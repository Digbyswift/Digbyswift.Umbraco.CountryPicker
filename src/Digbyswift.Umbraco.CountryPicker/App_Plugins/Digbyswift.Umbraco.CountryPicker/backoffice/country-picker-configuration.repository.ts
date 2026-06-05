import type { CountryPickerConfiguration } from './country.model';

const configurationEndpoint = '/umbraco/management/api/v1/digbyswift/country-picker/configuration';

export class CountryPickerConfigurationRepository {
    private static configuration?: CountryPickerConfiguration;

    public static async get(): Promise<CountryPickerConfiguration> {
        if (this.configuration) {
            return this.configuration;
        }

        const response = await fetch(configurationEndpoint, {
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Failed to load Country Picker configuration.');
        }

        const configuration = await response.json() as CountryPickerConfiguration;

        this.configuration = {
            flagBasePath: configuration.flagBasePath.replace(/\/$/, '')
        };

        return this.configuration;
    }
}
