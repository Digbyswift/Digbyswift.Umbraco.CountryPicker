import { defineConfig } from 'vite';
import { postBuildCopyToPackage, postBuildCopyToUmbraco } from './vite-plugins';

export default defineConfig({
    plugins: [
        postBuildCopyToPackage(),
        postBuildCopyToUmbraco()
    ],
    build: {
        lib: {
            entry: 'App_Plugins/Digbyswift.Umbraco.CountryPicker/backoffice/country-picker.element.ts',
            formats: ['es'],
            fileName: () => 'country-picker.element.js'
        },
        outDir: '../Digbyswift.Umbraco.CountryPicker/wwwroot/App_Plugins/Digbyswift.Umbraco.CountryPicker',
        emptyOutDir: false,
        rollupOptions: {
            external: [/^@umbraco-cms/]
        }
    }
});
