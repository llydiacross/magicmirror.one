import { InfinityMintProject } from '@app/interfaces';

const magicmirror: InfinityMintProject = {
	name: 'magicmirror',
	price: '$15',
	modules: {
		random: 'SeededRandom',
		assets: 'SimpleImage',
		minter: 'DefaultMinter',
		royalty: 'DefaultRoyalty',
	},
	information: {
		tokenSymbol: '†',
		tokenSingular: 'Example',
	},
	permissions: {
		all: [],
	},
	assets: [
		{
			name: 'Example Asset',
			fileName: '/imports/example-asset.svg',
			settings: true,
		},
	],
	paths: [
		{
			name: 'Example Token',
			fileName: '/imports/example.svg',
			settings: true,
		},
	],
	events: {
		async initialized({ log, eventEmitter }) {
			log('project initialized');
		},
		async failure({ log, event: error }) {
			log('failed to launch successfully');
			console.error(error);
		},
		async success({ log }) {
			log('successfully launched example project');
		},
	},
};

export default magicmirror;
