import express from 'express';
import glue from 'jsglue';
import { findEndpoints, getConfig, getEndpointPath } from './utils/helpers.mjs';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Session from 'express-session';
import { create } from 'ipfs-http-client';
import { createClient } from 'redis';

// do ts node register
import tsNode from 'ts-node';

tsNode.register({
	transpileOnly: true,
	compilerOptions: {
		module: 'commonjs',
	},
});

// load our .env
dotenv.config({
	override: false,
});

/**
 * Simple server class
 */
class Server {
	/**
	 * @type {import('infinitymint/dist/app/console').InfinityConsole}
	 * */
	infinityConsole;
	/**
	 * @type {import('express').Express}
	 */
	app;
	/**
	 * @type {import('redis').RedisClientType}
	 */
	redisClient;
	/**
	 * @type {number}
	 * */
	port;
	/**
	 * @type {import('ipfs-core').IPFS}
	 */
	node = null;
	/**
	 * @type {import('ipfs-http-client').IPFSHTTPClient}
	 */
	ipfs = null;
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

		this.redisClient = createClient();

		this.app.use(helmet());

		// allows CORS headers to work
		this.app.use((_, res, next) => {
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
			);
			next();
		});

		// the json body parser
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));

		// for dev
		this.app.use(morgan('dev'));

		// Integrating SIWE
		this.app.use(
			Session({
				name: 'magicmirror',
				secret: process.env.SIWE_SECRET,
				resave: true,
				saveUninitialized: true,
				cookie: { secure: false, sameSite: true },
			})
		);
	}

	async start() {
		const config = await getConfig();
		const wrapper = await glue.load();
		/**
		 * @type {import('infinitymint')}
		 */
		const infinitymint = wrapper.getSync('infinitymint');

		const infinityConsole = await infinitymint.load({
			dontDraw: true,
			scriptMode: true,
			startExpress: false,
			startGanache: false,
			test: true, // will expose all logs
		});

		this.infinityConsole = infinityConsole;
		this.config = config.default;
		this.ipfs = create({
			url: config.ipfsEndpoint || 'https://dweb.link/api/v0',
		});

		// set CORS after config has been loaded
		this.app.use(
			cors({
				origin: config.cors && config.cors.length !== 0 ? config.cors : '*',
			})
		);

		// load all the endpoints
		await this.loadEndpoints();

		this.redisClient.on('err', (err) => {
			console.error(err.stack);
			process.exit(129);
		});

		this.redisClient
			.connect()
			.then(() => console.info('[RDB]: Redis client connected!'))
			.catch((err) => console.error(err.stack));

		this.app.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}

	/**
	 * Loads all the endpoints from the endpoints folder and adds them to the server
	 */
	async loadEndpoints() {
		const files = await findEndpoints();
		// load all the endpoints
		await Promise.all(
			files.map(async (file) => {
				const route = await import(file);
				const endpointPath = await getEndpointPath();
				let path =
					route.path ||
					file
						.replace(endpointPath, '')
						.replace('.mjs', '')
						.replace('.js', '')
						.replace(process.cwd(), '');

				if (path[0] !== '/') path = '/' + path;

				console.log('New route: ' + path);

				if (route.post) {
					console.log('\tPost Registered');
					this.app.post(path, async (req, res) => {
						try {
							await route.post(req, res);
						} catch (error) {
							console.log('Error in post route: ' + path);
							console.error(error);
						}
					});
				}

				if (route.get) {
					console.log('\tGet Registered');
					this.app.get(path, async (req, res) => {
						try {
							await route.get(req, res);
						} catch (error) {
							console.log('Error in get route: ' + path);
							console.error(error);
							res.statusCode(500).send({
								ok: false,
								error: error.message,
							});
						}
					});
				}

				if (route.default) {
					this.app.use(route.default);
				}

				this.routes.push(route);
			})
		);
	}
}

export const server = new Server();
export default server;
(async () => {
	await server.start();
})().catch((err) => {
	console.error(err.stack);
	process.exit(1);
});
