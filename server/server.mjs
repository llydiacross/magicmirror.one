import express from 'express';
import glue from 'jsglue';
import glob from 'glob';
import { getConfig } from './utils/helpers.mjs';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

//load our .env
dotenv.config({
  override: false,
});

/**
 * Simple server class
 */
class Server {
  /**
   * @type {import('express').Express}
   */
  app;
  /**
   * @type {number}
   * */
  port;
  /**
   * @type {import('ipfs-core').IPFS}
   */
  node = null;
  /**
   * @type {Array}
   */
  routes = [];
  /**
   * Only accessible after start
   * @type {import('../webeth.config')}
   */
  config;

  constructor(port = 9090) {
    this.app = express();
    this.port = port;
    //helmet
    this.app.use(helmet());
    //allows CORS headers to work
    this.app.use((req, res, next) => {
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

    //the json body parser
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    //for dev
    this.app.use(morgan('dev'));
  }

  async start() {
    let config = await getConfig();
    let wrapper = await glue.load();
    /**
     * @type {import('ipfs-core')}
     */
    let ipfs = wrapper.getSync('ipfs-core');

    this.config = config;
    this.node = await ipfs.create(config.ipfs || {});

    //set CORS after config has been loaded
    this.app.use(
      cors({
        origin: config.cors && config.cors.length !== 0 ? config.cors : '*',
      })
    );

    //find endpoints
    let files = await new Promise(async (resolve, reject) => {
      glob('./endpoints/**/*.mjs', (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });

    //load all the endpoints
    await Promise.all(
      files.map(async (file) => {
        const route = await import(file);
        if (!route.path) throw new Error('no path export for ' + file);
        if (route.post) app.post(route.path, route.post);
        else console.log('no post export for ' + route.path);
        if (route.get) app.get(route.path, route.get);
        else console.log('no get export for ' + route.path);
        if (route.default) app.use(route.default);
        this.routes.push(route);
      })
    );

    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

export const server = new Server();
export default server;

(async () => {
  await server.start();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
