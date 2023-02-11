import express from 'express';
import glue from 'jsglue';
import glob from 'glob';
import { getConfig } from './utils/helpers.mjs';

(async () => {
    //load glue so our modules can be loaded
    let webethConfig = await getConfig();
    let wrapper = await glue.load();
    /**
     * @type {import('ipfs-core')}
     */
    let ipfs = wrapper.getSync('ipfs-core');
    let node = await ipfs.create(webethConfig.ipfs || {});

    await new Promise((resolve, reject) => {
        glob('./endpoints/**/*.mjs', (err, files) => {
            if (err) {
                reject(err);
            }

            files.map((file) => {
                return import(file).then((route) => {

                    if (!route.path)
                        throw new Error('no path export for ' + file)

                    if (route.post)
                        app.post(route.path, route.post);
                    else
                        console.log('no post export for ' + route.path)
                    
                    if (route.get)
                        app.get(route.path, route.get);
                    else
                          console.log('no get export for ' + route.path)
                    
                    if(route.default)
                        app.use(route.default);
                });
            });
            resolve();
        });
    })

    let app = express();

})().catch((err) => { 
    console.error(err);
    process.exit(1);
})