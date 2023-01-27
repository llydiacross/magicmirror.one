import { ethers } from "ethers";
import { useState, useEffect, useContext, useRef } from "react";
import { Web3Context } from "../contexts/web3Context";

const useENSContext = ({ ensAddress }) => {
  const context = useContext(Web3Context);
  const [currentEnsAddress, setCurrentEnsAddress] = useState(ensAddress);
  const [resolver, setResolver] = useState<ethers.providers.Resolver>(null);
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState(null);
  const [owner, setOwner] = useState(null);
  const [contentHash, setContentHash] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [ensError, setEnsError] = useState(null);

  useEffect(() => {
    if (!context.loaded) return;
    setLoaded(false);

    if (currentEnsAddress === null) {
      setEnsError(new Error("No ENS address provided"));
      return;
    }

    let main = async () => {
      setEnsError(null);
      let resolver = await context.web3Provider.getResolver(currentEnsAddress);

      if (resolver === null)
        throw new Error('No resolver found for "' + currentEnsAddress + '"');

      setResolver(resolver);

      try {
        setAvatar(await resolver.getText("avatar"));
      } catch (error) {
        console.log("bad avatar: " + error.message);
        setAvatar(null);
      }

      try {
        setEmail(await resolver.getText("email"));
      } catch (error) {
        console.log("bad email: " + error.message);
        setEmail(null);
      }

      try {
        setOwner(await context.web3Provider.resolveName(currentEnsAddress));
      } catch (error) {
        console.log("bad owner: " + error.message);
        setOwner(null);
      }

      try {
        setContentHash(await resolver.getContentHash());
      } catch (error) {
        console.log("bad content hash: " + error.message);
        setContentHash(null);
      }

      console.log("loaded ens: " + currentEnsAddress);
      setLoaded(true);
    };
    main().catch((error) => {
      setEnsError(error.message);
      setLoaded(true);
    });
  }, [currentEnsAddress, context]);

  return {
    resolver,
    loaded,
    email,
    contentHash,
    owner,
    ensError,
    avatar,
    currentEnsAddress,
    setCurrentEnsAddress,
  };
};

export default useENSContext;
