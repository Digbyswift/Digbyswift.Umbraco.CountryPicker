import { defineConfig } from 'vite';
import { copyToUmbracoPlugin } from './copy-to-umbraco-plugin';

export default defineConfig({
        plugins: [copyToUmbracoPlugin()],
        build: {
            lib: {
                entry: 'App_Plugins/Digbyswift.Umbraco.CountryPicker/backoffice/country-picker.element.ts',
                formats: ['es'],
                fileName: () => 'country-picker.element.js'
            },
            outDir: 'App_Plugins/Digbyswift.Umbraco.CountryPicker/backoffice',
            emptyOutDir: false,
            rollupOptions: {
                external: [/^@umbraco-cms\/backoffice/]
            }
        }
    });
