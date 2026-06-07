using System.Text.Json;
using Digbyswift.Umbraco.CountryPicker.Core.Models;
using Digbyswift.Umbraco.CountryPicker.Core.PropertyEditors;
using Digbyswift.Umbraco.CountryPicker.Core.Services;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Digbyswift.Umbraco.CountryPicker.Core.PropertyValueConverters;

public sealed class CountryPickerValueConverter : PropertyValueConverterBase
{
    private readonly ICountryProvider _countryProvider;

    public CountryPickerValueConverter(ICountryProvider countryProvider)
    {
        _countryProvider = countryProvider;
    }

    public override bool IsConverter(IPublishedPropertyType propertyType)
    {
        return String.Equals(propertyType.EditorAlias, CountryPickerDataEditor.Alias, StringComparison.OrdinalIgnoreCase);
    }

    public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
    {
        return IsMultiple(propertyType)
            ? typeof(IEnumerable<Country>)
            : typeof(Country);
    }

    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
    {
        return PropertyCacheLevel.Elements;
    }

    public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
    {
        if (source is null)
            return null;

        var value = source.ToString();
        if (String.IsNullOrWhiteSpace(value))
            return null;

        if (IsMultiple(propertyType))
        {
            return IsNotJson(value)
                ? value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                : JsonSerializer.Deserialize<string[]>(value) ?? [];
        }

        return value.Trim().Trim('"');
    }

    public override object? ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object? inter,
        bool preview)
    {
        if (IsMultiple(propertyType))
        {
            if (inter is not IEnumerable<string> codes)
                return Enumerable.Empty<Country>();

            return codes
                .Select(x => _countryProvider.GetByCode(x))
                .Where(country => country is not null)
                .Cast<Country>()
                .ToArray();
        }

        return inter is string code
            ? _countryProvider.GetByCode(code)
            : null;
    }

    private static bool IsMultiple(IPublishedPropertyType propertyType)
    {
        if (propertyType.DataType.ConfigurationObject is Dictionary<string, object> configuration)
            return configuration.TryGetValue("multiple", out var value) && value.ToString()?.ToLowerInvariant() == "true";

        return false;
    }

    private static bool IsNotJson(string value)
    {
        var span = value.AsSpan().Trim();

        return span[0] != '{' && span[0] != '[';
    }
}
