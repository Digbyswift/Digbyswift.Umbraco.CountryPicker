import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'App_Plugins/Digbyswift.CountryPicker/backoffice/country-picker.element.ts',
            formats: ['es'],
            fileName: () => 'country-picker.element.js'
        },
        outDir: 'App_Plugins/Digbyswift.CountryPicker/backoffice',
        emptyOutDir: false,
        rollupOptions: {
            external: [/^@umbraco-cms\/backoffice/]
        }
    }
});
