using System.Globalization;
using Digbyswift.Umbraco.CountryPicker.Core.Configuration;
using Digbyswift.Umbraco.CountryPicker.Core.Models;
using Microsoft.Extensions.Options;

namespace Digbyswift.Umbraco.CountryPicker.Core.Services;

public sealed class CountryProvider : ICountryProvider
{
    private readonly CountryPickerOptions _options;
    private readonly Lazy<IReadOnlyDictionary<string, RegionInfo>> _regions;

    public CountryProvider(IOptions<CountryPickerOptions> options)
    {
        _options = options.Value;
        _regions = new Lazy<IReadOnlyDictionary<string, RegionInfo>>(CreateRegionDictionary);
    }

    public Country? GetByCode(string code)
    {
        if (String.IsNullOrWhiteSpace(code))
        {
            return null;
        }

        return _regions.Value.TryGetValue(code.Trim(), out var region)
            ? CreateCountry(region)
            : null;
    }

    public IReadOnlyCollection<Country> GetAll()
    {
        return _regions.Value.Values
            .OrderBy(x => x.EnglishName)
            .Select(CreateCountry)
            .ToArray();
    }

    private static Dictionary<string, RegionInfo> CreateRegionDictionary()
    {
        return CultureInfo
            .GetCultures(CultureTypes.SpecificCultures)
            .Select(culture => new RegionInfo(culture.Name))
            .Where(region => IsIsoAlpha2Code(region.TwoLetterISORegionName))
            .GroupBy(region => region.TwoLetterISORegionName, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.First())
            .ToDictionary(
                region => region.TwoLetterISORegionName,
                region => region,
                StringComparer.OrdinalIgnoreCase);
    }

    private static bool IsIsoAlpha2Code(string value)
    {
        return value.Length == 2 && value.All(Char.IsLetter);
    }

    private Country CreateCountry(RegionInfo region)
    {
        return new Country
        {
            Code = region.TwoLetterISORegionName,
            Code3 = region.ThreeLetterISORegionName,
            Name = region.EnglishName,
            Flag = BuildFlagUrl(region.TwoLetterISORegionName)
        };
    }

    private string BuildFlagUrl(string code)
    {
        var basePath = String.IsNullOrWhiteSpace(_options.FlagBasePath)
            ? "/App_Plugins/Digbyswift.Umbraco.CountryPicker/assets/flags"
            : _options.FlagBasePath.TrimEnd('/');

        return $"{basePath}/{code.ToLowerInvariant()}.svg";
    }
}
