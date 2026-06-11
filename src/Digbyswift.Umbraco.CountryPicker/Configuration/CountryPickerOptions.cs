namespace Digbyswift.Umbraco.CountryPicker.Configuration;

public sealed class CountryPickerOptions
{
    public const string SectionName = "Digbyswift:CountryPicker";

    public string FlagBasePath { get; set; } = "/App_Plugins/Digbyswift.Umbraco.CountryPicker/assets/flags";
}
