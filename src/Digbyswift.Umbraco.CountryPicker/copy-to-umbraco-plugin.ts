import * as fs from 'node:fs';

export function copyToUmbracoPlugin() {
    return {
        name: 'copy-to-umbraco',
        closeBundle() {
            fs.cpSync(
                'App_Plugins',
                '../Umbraco.Cms.v17.x/App_Plugins',
                {
                    recursive: true,
                    filter: source => !source.endsWith('.ts')
                }
            );
        }
    };
}