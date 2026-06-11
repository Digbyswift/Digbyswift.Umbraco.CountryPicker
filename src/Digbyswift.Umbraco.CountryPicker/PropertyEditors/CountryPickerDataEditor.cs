using Umbraco.Cms.Core.PropertyEditors;

namespace Digbyswift.Umbraco.CountryPicker.PropertyEditors;

[DataEditor(Constants.ProjectNamespace, ValueType = ValueTypes.Json)]
public sealed class CountryPickerDataEditor(IDataValueEditorFactory dataValueEditorFactory) : DataEditor(dataValueEditorFactory);
