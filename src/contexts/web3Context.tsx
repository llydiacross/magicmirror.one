import React, { createContext } from 'react'
import Header from '../components/Header'
import useWeb3Context from '../effects/useWeb3Context'
import { ethers } from 'ethers'

export interface Web3ContextType {
  balance: null
  accounts: string[]
  ensAddresses: string[]
  walletInstalled: false
  walletConnected: false
  walletAddress: '0x0'
  web3Provider:
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider
  walletError: Error
  chainId: 0
  loaded: false
  signer: ethers.Signer
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
  loaded: false
} as Web3ContextType)

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
    balance
  } = useWeb3Context()

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
          balance
        } as Web3ContextType
      }
    >
      {loaded
        ? (
          <>{children}</>
          )
        : (
          <Header
            theme='acid'
            initialText='Initializing Web3 Connection...'
            showFinder={false}
          />
          )}
    </Web3Context.Provider>
  )
}
export default Web3ContextProvider
