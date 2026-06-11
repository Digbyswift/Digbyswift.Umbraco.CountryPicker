export const manifests: Array<UmbExtensionManifest> = [
    {
        type: "propertyEditorUi",
        name: "Country Picker UI",
        alias: "Digbyswift.Umbraco.CountryPicker.Ui",
        elementName: "digbyswift-country-picker",
        js: () => import("./country-picker.element.js"),
        meta: {
            label: "Country Picker",
            propertyEditorSchemaAlias: "Digbyswift.Umbraco.CountryPicker",
            icon: "icon-flag",
            group: "pickers",
            supportsReadOnly: true,
            settings: {
                properties: [
                    {
                        alias: 'multiple',
                        label: 'Allow multiple',
                        description: 'Allow editors to select more than one country',
                        propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
                    },
                ],
                defaultData: [{ alias: 'multiple', value: false }],
            },
        }
    },
    {
        type: 'propertyEditorSchema',
        name: 'Country Picker Property Editor Schema',
        alias: 'Digbyswift.Umbraco.CountryPicker',
        meta: {
            defaultPropertyEditorUiAlias: 'Digbyswift.Umbraco.CountryPicker.Ui',
        },
    }
];
