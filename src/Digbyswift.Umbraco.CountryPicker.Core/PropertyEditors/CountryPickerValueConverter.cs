using System.Text.Json;
using Digbyswift.Umbraco.CountryPicker.Core.Models;
using Digbyswift.Umbraco.CountryPicker.Core.Services;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Digbyswift.Umbraco.CountryPicker.Core.PropertyEditors;

public sealed class CountryPickerValueConverter : PropertyValueConverterBase
{
    public const string PropertyEditorAlias = "Digbyswift.CountryPicker";

    private readonly ICountryProvider _countryProvider;

    public CountryPickerValueConverter(ICountryProvider countryProvider)
    {
        this._countryProvider = countryProvider;
    }

    public override bool IsConverter(IPublishedPropertyType propertyType)
    {
        return String.Equals(propertyType.EditorAlias, PropertyEditorAlias, StringComparison.OrdinalIgnoreCase);
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

    public override object? ConvertSourceToIntermediate(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        object? source,
        bool preview)
    {
        if (source is null)
        {
            return null;
        }

        var value = source.ToString();

        if (String.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        if (IsMultiple(propertyType))
        {
            return JsonSerializer.Deserialize<string[]>(value) ?? Array.Empty<string>();
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
            {
                return Enumerable.Empty<Country>();
            }

            return codes
                .Select(code => this._countryProvider.GetByCode(code))
                .Where(country => country is not null)
                .Cast<Country>()
                .ToArray();
        }

        return inter is string code
            ? this._countryProvider.GetByCode(code)
            : null;
    }

    private static bool IsMultiple(IPublishedPropertyType propertyType)
    {
        return propertyType.DataType.ConfigurationAs<CountryPickerConfiguration>()?.Multiple == true;
    }
}
