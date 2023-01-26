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
  const [valid, setValid] = useState(false);
  const [ensError, setEnsError] = useState(null);

  useEffect(() => {
    if (!context.loaded) return;
    setLoaded(false);

    if (currentEnsAddress === null) {
      setValid(true);
      setLoaded(true);
      return;
    }

    let main = async () => {
      let resolver = await context.web3Provider.getResolver(currentEnsAddress);

      if (resolver === null)
        throw new Error('No resolver found for "' + currentEnsAddress + '"');

      setEnsError(null);
      setResolver(resolver);
      setAvatar(await resolver.getText("avatar"));
      setEmail(await resolver.getText("email"));
      setOwner(await context.web3Provider.resolveName(currentEnsAddress));
      setContentHash(await resolver.getContentHash());

      console.log("loaded ens: " + currentEnsAddress);
      setValid(true);
      setLoaded(true);
    };
    main().catch((error) => {
      setValid(false);
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
    valid,
    currentEnsAddress,
    setCurrentEnsAddress,
  };
};

export default useENSContext;
