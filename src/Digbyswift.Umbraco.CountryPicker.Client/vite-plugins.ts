import * as fs from 'node:fs';
import consts from './vite-consts';

export function postBuildCopyToPackage() {
    return {
        name: 'copy-to-package',
        closeBundle() {
            fs.cpSync(
                consts.clientPluginPath + '/assets',
                consts.packageProjectStaticAssetsDirectory + '/' +  consts.clientPluginPath + '/assets',
                {
                    recursive: true,
                    filter: source => !source.endsWith('.ts')
                }
            );
        }
    };
}

export function postBuildCopyToUmbraco() {
    return {
        name: 'copy-to-umbraco',
        closeBundle() {
            fs.cpSync(
                'App_Plugins',
                consts.umbracoProjectDirectory + '/App_Plugins',
                {
                    recursive: true,
                    filter: source => !source.endsWith('.ts')
                }
            );
        }
    };
}