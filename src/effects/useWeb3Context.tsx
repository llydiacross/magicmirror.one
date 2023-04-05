import { ethers } from 'ethers';
import { useState, useEffect, useRef } from 'react';
import config from '../config';
import WebEvents from '../webEvents';

const useWeb3Context = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [ensAddresses, setEnsAddresses] = useState([]);
  const [chainId, setChainId] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState<ethers.Signer>(null);
  const [web3Provider, setWeb3Provider] = useState<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  >(null);
  const [loaded, setLoaded] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [balance, setBalance] = useState(null);

  const refreshEvent = useRef(null);
  const walletChangedEvent = useRef(null);

  const requestAccounts = async () => {
    if ((window as any).ethereum === undefined) return [];

    const result = await (window as any).ethereum.request({
      method: 'eth_accounts',
    });

    return result;
  };

  const checkWalletConnected = async () => {
    if ((window as any).ethereum === undefined) return false;

    try {
      const result = await (window as any).ethereum.request({
        method: 'eth_accounts',
      });
      return result && result.length !== 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   *
   * @param {ethers.providers.Web3Provider} provider
   * @returns {float}
   */
  const requestBalance = async (provider, account) => {
    return parseFloat(
      ethers.utils.formatEther(await provider.getBalance(account))
    );
  };

  /**
   *
   * @param {ethers.providers.Web3Provider} provider
   * @returns
   */
  const requestChainId = async (provider) => {
    const { chainId } = await provider.getNetwork();
    return parseInt(chainId);
  };

  useEffect(() => {
    if (loaded) return;

    const main = async () => {
      try {
        /* Empty */
      } catch (walletError) {
        WebEvents.emit('walletError', walletError);
        console.error(walletError);
        setWalletError(walletError);
      }

      setWalletInstalled(
        (window as any).ethereum !== undefined &&
          typeof (window as any).ethereum === 'object'
      );

      const connected = await checkWalletConnected();
      console.log(
        'wallet: ' + (connected ? 'connected' : 'unconnected'),
        'web3'
      );
      setWalletConnected(connected);

      if (!connected) setWalletError(new Error('Wallet not connected'));
      let provider:
        | ethers.providers.Web3Provider
        | ethers.providers.JsonRpcProvider;
      if (connected) {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
      } else {
        provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
      }

      // Test it
      try {
        await provider.getBlockNumber();
      } catch (error) {
        console.error(error);
        setWalletError(
          new Error('There is something wrong with your provider')
        );
      }

      if (connected) {
        const accounts = await requestAccounts();
        setAccounts(accounts);

        const signer = provider.getSigner();
        setSigner(signer);
        setChainId(await requestChainId(provider));
        setWalletAddress(await signer.getAddress());
        setBalance(await requestBalance(provider, accounts[0]));

        const ensAddresses = [];
        for (let i = 0; i < accounts.length; i++) {
          try {
            ensAddresses[i] = await provider.lookupAddress(accounts[i]);
          } catch (error) {
            console.log('bad or no ens for: ' + accounts[i]);
            ensAddresses[i] = false;
          }
        }

        setEnsAddresses(ensAddresses);
      }

      setWeb3Provider(provider);
      setLoaded(true);
    };

    const accountsChanged = (accounts) => {
      if (loaded && accounts[0].toLowerCase() === walletAddress.toLowerCase())
        return;

      setLoaded(false);
      main();
    };

    if (refreshEvent.current === null) refreshEvent.current = main;
    if (walletChangedEvent.current === null)
      walletChangedEvent.current = accountsChanged;

    //set the reload web event to redo main
    WebEvents.on('reload', main);
    //run main
    main();

    return () => {
      //undo main
      WebEvents.off('reload', main);
    };
  }, [loaded]);

  return {
    walletConnected,
    walletInstalled,
    walletAddress,
    accounts,
    chainId,
    web3Provider,
    loaded,
    signer,
    balance,
    refreshEvent,
    walletChangedEvent,
    walletError,
    ensAddresses,
  };
};

export default useWeb3Context;
