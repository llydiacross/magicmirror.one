import { InfinityMintProject } from '@app/interfaces';

const magicmirror: InfinityMintProject = {
	name: 'magicmirror',
	price: '$0.69',
	modules: {
		random: 'SeededRandom',
		assets: 'SimpleSVG',
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
	paths: [
		{
			name: 'Magic Ticket',
			fileName: '/imports/ticket.svg',
			settings: true,
		},
	],
};

export default magicmirror;
