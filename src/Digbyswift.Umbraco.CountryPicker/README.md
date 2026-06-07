# Digbyswift Umbraco Country Picker

Umbraco 17 property editor for selecting one or more ISO countries with SVG flags.

## Stored value

Single selection stores:

```json
"GB"
```

Multiple selection stores:

```json
["GB", "US", "FR"]
```

## ModelsBuilder output

The property value converter resolves selected codes to:

```json
{
  "code": "GB",
  "code3": "GBR",
  "name": "United Kingdom",
  "flag": "/App_Plugins/Digbyswift.Umbraco.CountryPicker/assets/flags/gb.svg"
}
```

## appsettings.json

```json
{
  "Digbyswift": {
    "CountryPicker": {
      "FlagBasePath": "/App_Plugins/Digbyswift.Umbraco.CountryPicker/assets/flags"
    }
  }
}
```

The flag URL is deterministic. No flag filename is stored in the provider or editor data.

## Country data

- Server-side: uses `System.Globalization.RegionInfo`.
- Backoffice picker: uses a generated static ISO 3166 country dataset for fast client-side search.

## Build backoffice asset

```bash
npm install
npm run build
```

This outputs:

```text
App_Plugins/Digbyswift.Umbraco.CountryPicker/backoffice/country-picker.element.js
```

## Flags

Copy SVG files into:

```text
App_Plugins/Digbyswift.Umbraco.CountryPicker/assets/flags/
```

Filenames must be lowercase ISO alpha-2 codes, e.g. `gb.svg`.
