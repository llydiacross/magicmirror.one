import { InfinityMintClientConfig } from 'infinitymint-client/src/core/interfaces';

const config: InfinityMintClientConfig = {
	sitemap: [{}],
	env: {
		NODE_ENV: 'dev',
	},
	api: {
		developer: 'http://localhost:1337',
		production: 'https://api.infinitymint.app',
	},
	rendering: {
		rendererProps: {},
	},
	network: {
		default: {
			developer: 'ganache',
			production: 'polygon',
		},
		providers: {
			ethereum:
				'https://mainnet.infura.io/v3/ef00c000f793483bbf8506235ba4439b',
			polygon: 'https://polygon-rpc.com',
			mumbai: 'https://matic-mumbai.chainstacklabs.com',
		},
		alwaysCreateStaticProviders: true,
		setDefaultUsingApi: true,
	},
	resources: {
		default: 'default',
	},
	projects: {
		require: {
			magicmirror: {},
			'CHRONICLES 🎫 @1.0.0': {}
		},
		default: {
			dev: 'magicmirror@1.0.0_ganache',
			production: 'magicmirror@1.0.0_polygon',
		},
		useInfinityMintApi: true,
	},
};

export default config;
