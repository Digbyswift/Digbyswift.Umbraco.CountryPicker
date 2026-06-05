namespace Digbyswift.Umbraco.CountryPicker.Core.Configuration;

public sealed class CountryPickerOptions
{
    public const string SectionName = "Digbyswift:CountryPicker";

    public string FlagBasePath { get; set; } = "/App_Plugins/Digbyswift.CountryPicker/assets/flags";
}
