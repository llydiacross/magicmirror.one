import express from 'express';
import glue from 'jsglue';
import { findEndpoints, getEndpointPath, userError } from './utils/helpers.mjs';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Session from 'express-session';
import { create } from 'ipfs-http-client';
import { createClient } from 'redis';
import { Alchemy, Network } from 'alchemy-sdk';
//prisma
import { PrismaClient } from '@prisma/client';
// do ts node register
import tsNode from 'ts-node';
import { Configuration, OpenAIApi } from 'openai';
import { isLoggedIn } from './utils/helpers.mjs';

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
export class Server {
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
	 * @type {PrismaClient}
	 **/
	prisma;
	/**
	 * @type {import('openai').OpenAIApi}
	 */
	openAI;
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
	 * @type {Alchemy}
	 */
	alchemy = null;

	/**
	 * @type {import('infinitymint/dist/app/interfaces').InfinityMintConfig}
	 */
	config;

	constructor(port = 9090) {
		if (!process.env.SIWE_SECRET)
			throw new Error(
				'SIWE_SECRET not set in .env. Please make sure to set it. It can equal any random base64 string.'
			);

		if (!process.env.ALCHEMY_API_KEY)
			throw new Error(
				'ALCHEMY_API_KEY not set in .env. Please set your alchemy API key in the .env and start again.'
			);

		if (!process.env.OPENAI_API_KEY)
			throw new Error(
				'OPENAI_API_KEY not set in .env. Please set your openai API key in the .env and start again.'
			);

		if (!process.env.DATABASE_URL)
			throw new Error(
				'DATABASE_URL not set in .env. Please set your postgress database url in the .env and start again.'
			);

		this.app = express();
		this.port = port;

		//helmet stuff for security
		this.app.use(helmet());

		this.app.use((_, res, next) => {
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
			);
			res.header('Access-Control-Allow-Credentials', 'true');
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
		//load InfinityMint
		let wrapper = await glue.load();
		/**
		 * @type {import('infinitymint')}
		 */
		this.infinityConsole = await wrapper.getSync('infinitymint').load({
			dontDraw: true,
			scriptMode: true,
			startExpress: false,
			startGanache: false,
			test: true, // will expose all logs
		});
		this.config = this.infinityConsole.Helpers.getConfigFile();
		this.ipfs = create({
			url:
				this.config.magicMirror.ipfsEndpoint ||
				'https://dweb.link/api/v0',
		});
		this.alchemy = new Alchemy({
			apiKey: process.env.ALCHEMY_API_KEY,
			network: Network.ETH_MAINNET,
		});
		this.redisClient = createClient();
		this.prisma = new PrismaClient();
		this.openAI = new OpenAIApi(
			new Configuration(
				this?.config?.magicMirror?.openapi &&
				this?.config?.magicMirror?.openapi?.apiKey
					? this.config.magicMirror.openapi
					: {
							apiKey: process.env.OPENAI_API_KEY,
					  }
			)
		);

		// set CORS after config has been loaded
		this.app.use(
			cors({
				origin:
					this.config.magicMirror.cors &&
					this.config.magicMirror.cors.length !== 0
						? this.config.magicMirror.cors
						: '*',
			})
		);

		//wait for redis to connect
		await this.redisClient.connect();
		// load all the endpoints
		await this.loadEndpoints();

		// handle redis errors
		this.redisClient.on('err', (err) => {
			console.error(err.stack);
			process.exit(129);
		});

		//start listening
		this.app.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}

	/**
	 * Loads all the endpoints from the endpoints folder and adds them to the server
	 */
	async loadEndpoints() {
		let endpointPath = getEndpointPath(this.config);
		let files = await findEndpoints(endpointPath);

		// load all the endpoints
		await Promise.all(
			files.map(async (file) => {
				const route = await import(file);

				let path =
					route.path ||
					file
						.replace(endpointPath, '')
						.replace('.mjs', '')
						.replace('.js', '')
						.replace(process.cwd(), '');

				if (path[0] !== '/') path = '/' + path;

				console.log('New route: ' + path);
				let _route = async (method) => {
					console.log('\t' + method.toUpperCase() + ' Registered');
					if (route.settings !== undefined) {
						if (route.settings.requireLogin) {
							let result = await isLoggedIn(req, this);

							if (result !== true) return userError(res, result);
						}

						if (route.settings.admin && !req.session.admin)
							return userError(res, 'Admin only route');
					}

					try {
						await route[method](req, res);
					} catch (error) {
						console.log(
							`Error in ${method.toUpperCase()} route: ` + path
						);
						console.error(error);
						return userError(res, 'Internal Server Error');
					}
				};

				if (route.settings) {
					if (route.settings.requireLogin) {
						console.log('\tLogin Required');
					}

					if (route.settings.admin) {
						console.log('\tAdmin Only');
					}
				}

				if (route.default) {
					console.log('\tMiddleware Registered');
					this.app.use(route.default);
				}

				if (route.post) {
					console.log('\tPost Registered');
					this.app.post(path, async (req, res) => {
						await _route('post');
					});
				}

				if (route.get) {
					console.log('\tGet Registered');
					this.app.get(path, async (req, res) => {
						await _route('get');
					});
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
