import React, { createContext } from "react";
import Header from "../components/Header";
import useWeb3Context from "../effects/useWeb3Context";

export const AppContext = createContext({
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

const AppContextProvider = ({ children }) => {
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
    <AppContext.Provider
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
        <Header theme="dark" title="welcome" showFinder={false} />
      )}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
