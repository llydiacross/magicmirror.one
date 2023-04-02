import { debugLog, readGlobalSession } from 'infinitymint/dist/app/helpers';

//the session
let session = readGlobalSession();
//please visit docs.infinitymint.app
const config = {
  /** 
	telnet: {
		anonymous: true,
		events: {
			connected: async params => {
				//will log to that client
				params.log(
					'Welcome to Llydias InfinityMint Telnet Server ' +
						params.event.remoteAddress +
						'! Please enjoy your stay',
				);
				//then goto windows
				params.infinityConsole?.gotoWindow('Logs');
			},
		},
	},
	**/
  console: true,
  ipfs: true,
  hardhat: {
    solidity: {
      version: '0.8.12',
      settings: {
        optimizer: {
          enabled: true,
          runs: 20,
        },
      },
    },
    networks: {
      localhost: {
        url: 'http://127.0.0.1:1998',
      },
      ganache: {
        url: 'http://127.0.0.1:8545',
        accounts: {
          mnemonic: session.environment?.ganacheMnemonic,
        },
      },
      ethereum: {
        url: 'https://mainnet.infura.io/v3/ef00c000f793483bbf8506235ba4439b',
        accounts: {
          mnemonic:
            process.env.DEFAULT_WALLET_MNEMONIC ||
            session.environment?.ganacheMnemonic,
        },
      },
      goerli: {
        url: 'https://goerli.infura.io/v3/b893dc62f7a742198d70ba203081ae37',
        accounts: {
          mnemonic:
            process.env.DEFAULT_WALLET_MNEMONIC ||
            session.environment?.ganacheMnemonic,
        },
      },
      polygon: {
        url: 'https://polygon-rpc.com',
        accounts: {
          mnemonic:
            process.env.DEFAULT_WALLET_MNEMONIC ||
            session.environment?.ganacheMnemonic,
        },
      },
      mumbai: {
        url: 'https://matic-mumbai.chainstacklabs.com',
        accounts: {
          mnemonic:
            process.env.DEFAULT_WALLET_MNEMONIC ||
            session.environment?.ganacheMnemonic,
        },
      },
    },
    paths: {
      tests: './tests',
    },
  },
  ganache: {
    chain: {
      chainId: 1337,
    },
    wallet: {
      totalAccounts: 20,
      defaultBalance: 69420,
    },
  },
  roots: ['../infinitymint-buildtools/'],
  settings: {
    networks: {
      hardhat: {
        defaultAccount: 0,
      },
      ganache: {
        writeMnemonic: true,
        defaultAccount: 0,
        handlers: {
          gasPrice: async () => {
            return {
              slow: 1,
              medium: 1,
              fast: 1,
            };
          },
          tokenPrice: async () => {
            return {
              usd: 0,
            };
          },
        },
      },
    },
    compile: {
      supportedExtensions: ['.flac'],
    },
    build: {},
    scripts: {},
    deploy: {},
  },
};

export default config;
