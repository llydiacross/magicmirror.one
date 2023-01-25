import React, { createContext } from "react";
import Header from "../components/Header";
import useWeb3Context from "../effects/useWeb3Context";

export const Web3Context = createContext({
  balance: null,
  accounts: [],
  ensAddresses: [],
  walletInstalled: false,
  walletConnected: false,
  walletAddress: "0x0",
  web3Provider: null,
  walletError: null,
  chainId: 0,
  loaded: false,
  signer: null,
});

const Web3ContextProvider = ({ children }) => {
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
  } = useWeb3Context();

  return (
    <Web3Context.Provider
      value={{
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
      }}
    >
      {loaded ? (
        <>{children}</>
      ) : (
        <Header
          theme="dark"
          initialText="Initializing Web3 Connection..."
          showFinder={false}
        />
      )}
    </Web3Context.Provider>
  );
};
export default Web3ContextProvider;
