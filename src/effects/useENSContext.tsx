import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../contexts/appContext";
import WebEvents from "../webEvents";

const useENSContext = ({ ensAddress }) => {
  const context = useContext(AppContext);
  const [currentEnsAddress, setCurrentEnsAddress] = useState(ensAddress);
  const [resolver, setResolver] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState(null);
  const [contentHash, setContentHash] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [valid, setValid] = useState(false);
  const [ensError, setEnsError] = useState(null);
  const fetchContext = useRef(null);
  const reloadListener = useRef(null);

  useEffect(() => {
    if (!context.loaded) return;
    setValid(false);

    if (reloadListener.current === null) {
      reloadListener.current = (destination) => {
        setEnsError(null);
        setCurrentEnsAddress(destination);
        if (fetchContext.current !== null) fetchContext.current();
      };
    }

    WebEvents.off("gotoDestination", reloadListener.current);
    WebEvents.on("gotoDestination", reloadListener.current);

    if (currentEnsAddress === null) {
      setLoaded(true);
      return;
    }

    fetchContext.current = async () => {
      try {
        setEnsError(null);

        if (currentEnsAddress === null) {
          return;
        }

        let provider = context.web3Provider;
        let resolver = await provider.getResolver(currentEnsAddress);

        if (resolver === null) {
          setEnsError(
            new Error('Invalid ENS address "' + currentEnsAddress + '"')
          );
          setLoaded(true);
          return;
        }

        let cid: string;
        try {
          cid = await resolver.getContentHash();
          setContentHash(cid);
        } catch (error) {
          console.error(error);
        }

        let email = await resolver.getText("email");
        let avatar = await resolver.getText("avatar");

        setAvatar(avatar); //need to parse NFTs returned
        setEmail(email);
        setResolver(resolver);
        setLoaded(true);

        console.log("successfully set ENS context of " + currentEnsAddress, {
          resolver,
          cid,
          email,
          avatar,
        });
        setValid(true);
      } catch (error) {
        console.error(error);
        setEnsError(
          new Error('Invalid ENS address "' + currentEnsAddress + '"')
        );
        setLoaded(true);
      }
    };
    fetchContext.current();

    return () => {
      WebEvents.off("reloadENS", reloadListener.current);
    };
  }, [context, ensAddress, loaded, currentEnsAddress]);

  return {
    resolver,
    loaded,
    email,
    contentHash,
    ensError,
    avatar,
    setCurrentEnsAddress,
  };
};

export default useENSContext;
