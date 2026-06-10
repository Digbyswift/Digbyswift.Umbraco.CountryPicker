using Umbraco.Cms.Core.PropertyEditors;

namespace Digbyswift.Umbraco.CountryPicker.Core.PropertyEditors;

[DataEditor(Alias, ValueType = ValueTypes.Json)]
public sealed class CountryPickerDataEditor : DataEditor
{
    public const string Alias = "Digbyswift.Umbraco.CountryPicker";

    public CountryPickerDataEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
