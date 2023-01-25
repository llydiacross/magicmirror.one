import { ethers } from "ethers";
import { off } from "process";
import { useState, useEffect, useContext, useRef } from "react";
import { Web3Context } from "../contexts/web3Context";
import WebEvents from "../webEvents";

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
  const changeDestination = useRef(null);

  changeDestination.current = (destination: string) => {
    setLoaded(false);
    setResolver(null);
    setAvatar(null);
    setEmail(null);
    setOwner(null);
    setContentHash(null);
    setEnsError(null);
    setValid(false);
    setCurrentEnsAddress(
      destination.indexOf(".eth") > -1 ? destination : destination + ".eth"
    );
  };

  useEffect(() => {
    WebEvents.off("gotoDestination", changeDestination.current);
    WebEvents.on("gotoDestination", changeDestination.current);

    return () => {
      WebEvents.off("gotoDestination", changeDestination.current);
    };
  }, []);

  useEffect(() => {
    if (!context.loaded) return;

    setLoaded(false);
    if (currentEnsAddress == null) {
      setLoaded(true);
      return;
    }
    let main = async () => {
      let resolver = await context.web3Provider.getResolver(currentEnsAddress);

      if (resolver === null)
        throw new Error('No resolver found for "' + currentEnsAddress + '"');

      setResolver(resolver);
      setAvatar(await resolver.getText("avatar"));
      setEmail(await resolver.getText("email"));
      setOwner(await context.web3Provider.resolveName(currentEnsAddress));
      setContentHash(await resolver.getContentHash());
      setValid(true);
      console.log("loaded ens: " + currentEnsAddress);
    };
    main()
      .catch((error) => {
        setEnsError(error.message);
      })
      .finally(() => {
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
