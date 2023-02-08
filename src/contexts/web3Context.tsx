import React, { createContext, useEffect } from 'react';
import Header from '../components/Header';
import useWeb3Context from '../effects/useWeb3Context';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import WebEvents from '../webEvents';

export interface Web3ContextType {
  balance: null;
  accounts: string[];
  ensAddresses: string[];
  walletInstalled: false;
  walletConnected: false;
  walletAddress: '0x0';
  web3Provider:
    | ethers.providers.Web3Provider
    | ethers.providers.JsonRpcProvider;
  walletError: Error;
  chainId: 0;
  loaded: false;
  refreshRef: Function;
  walletChangedRef: Function;
  signer: ethers.Signer;
}

export const Web3Context = createContext({
  balance: null,
  accounts: [],
  ensAddresses: [],
  signer: null,
  walletInstalled: false,
  walletConnected: false,
  walletAddress: '0x0',
  web3Provider: null,
  walletError: null,
  chainId: 0,
  refreshRef: null,
  loaded: false,
  walletChangedRef: null,
} as Web3ContextType);

function Web3ContextProvider({ children }) {
  const {
    accounts,
    walletInstalled,
    walletConnected,
    walletAddress,
    chainId,
    loaded,
    web3Provider,
    signer,
    walletError,
    ensAddresses,
    balance,
    refreshRef,
    walletChangedRef,
  } = useWeb3Context();

  //in order to avoid the events being deleted on every update to the context, we need to use a cleanup function and define events here here not in the context
  useEffect(() => {
    if (!loaded) return;

    if ((window as any).ethereum !== undefined) {
      (window as any).ethereum.on('accountsChanged', walletChangedRef.current);
      (window as any).ethereum.on('chainChanged', walletChangedRef.current);
    }

    return () => {
      WebEvents.off('reload', refreshRef.current);
      if ((window as any).ethereum !== undefined) {
        (window as any).ethereum.removeListener(
          'accountsChanged',
          walletChangedRef.current
        );
        (window as any).ethereum.removeListener(
          'chainChanged',
          walletChangedRef.current
        );
      }
    };
  }, [loaded]);

  return (
    <Web3Context.Provider
      value={
        {
          accounts,
          walletInstalled,
          walletConnected,
          walletAddress,
          chainId,
          loaded,
          ensAddresses,
          web3Provider,
          signer,
          walletError,
          balance,
          refreshRef: refreshRef.current,
        } as Web3ContextType
      }
    >
      {loaded ? (
        <>{children}</>
      ) : (
        <Header
          theme="acid"
          initialText="Initializing Web3 Connection..."
          showFinder={false}
        />
      )}
    </Web3Context.Provider>
  );
}

Web3ContextProvider.propTypes = {
  children: PropTypes.any,
};

export default Web3ContextProvider;
