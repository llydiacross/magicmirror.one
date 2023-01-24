import { ethers } from "ethers";
import { useState, useEffect } from "react";
import config from "../config";
import WebEvents from "../webEvents";

const useWeb3Context = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [chainId, setChainId] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [walletAddress, setWalletAddress] = useState("0x0");
  const [signer, setSigner] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [balance, setBalance] = useState(null);

  const requestAccounts = async () => {
    if ((window as any).ethereum === undefined) return [];

    let result = await (window as any).ethereum.request({
      method: "eth_accounts",
    });

    return result;
  };

  const checkWalletConnected = async () => {
    if ((window as any).ethereum === undefined) return false;

    try {
      let result = await (window as any).ethereum.request({
        method: "eth_accounts",
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
    let { chainId } = await provider.getNetwork();
    return parseInt(chainId);
  };

  useEffect(() => {
    if (loaded) return;

    const main = async () => {
      try {
      } catch (walletError) {
        WebEvents.emit("walletError", walletError);
        console.error(walletError);
        setWalletError(walletError);
      }

      setWalletInstalled(
        (window as any).ethereum !== undefined &&
          typeof (window as any).ethereum === "object"
      );

      let connected = await checkWalletConnected();
      console.log(
        "wallet: " + (connected ? "connected" : "unconnected"),
        "web3"
      );
      setWalletConnected(connected);

      if (!connected) setWalletError(new Error("Wallet not connected"));
      let provider: any;
      if (connected)
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
      else {
        provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
      }

      //test it
      try {
        await provider.getBlockNumber();
      } catch (error) {
        console.error(error);
        setWalletError(
          new Error("There is something wrong with your provider")
        );
      }

      if (connected) {
        let accounts = await requestAccounts();
        setAccounts(accounts);

        let signer = provider.getSigner();
        setSigner(signer);
        setChainId(await requestChainId(provider));
        setWalletAddress(await signer.getAddress());
        setBalance(await requestBalance(provider, accounts[0]));
      }

      setWeb3Provider(provider);
      setLoaded(true);
    };
    main();
  }, [loaded]);

  useEffect(() => {
    if (accounts && web3Provider) requestBalance(web3Provider, accounts[0]);
  }, [accounts, web3Provider]);

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
    walletError,
  };
};

export default useWeb3Context;
