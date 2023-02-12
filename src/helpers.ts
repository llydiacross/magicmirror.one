import { getProvider } from './ipfs';

export const getIPFSProvider = (
  provider?: 'web3-storage' | 'ipfs-companion'
) => {
  provider = provider || 'web3-storage';
  return getProvider(provider);
};
