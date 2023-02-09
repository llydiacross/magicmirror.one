import { ethers } from 'ethers';
import { useState, useEffect, useContext, useRef } from 'react';
import config from '../config';
import { Web3Context } from '../contexts/web3Context';
import { resolveDirectory, resolveFile, resolveIPNS } from '../ipfs';
import { Buffer } from 'buffer';

const prepareAvatar = async (
  resolver,
  context,
  fetchImageRef,
  fetchMetadataRef
) => {
  try {
    let potentialAvatar = await resolver.getText('avatar');

    if (potentialAvatar === null) {
      throw new Error('no avatar');
    }

    //resolve ipns
    if (
      potentialAvatar.indexOf('ipns://') !== -1 ||
      potentialAvatar.indexOf('ipns/') !== -1
    ) {
      if (potentialAvatar.indexOf('ipns/') !== -1)
        potentialAvatar = potentialAvatar.split('ipns/')[1];

      potentialAvatar = (
        await resolveIPNS(
          potentialAvatar.replace('ipns://', ''),
          fetchImageRef.current
        )
      )
        .replace('ipfs/', 'ipfs://')
        .replace('/ipfs/', 'ipfs://');
    }

    if (
      potentialAvatar.indexOf('eip155:1/erc1155') !== -1 ||
      potentialAvatar.indexOf('eip155:1/erc721') !== -1
    ) {
      let stub: string;
      if (potentialAvatar.indexOf('eip155:1/erc721') !== -1)
        stub = potentialAvatar.split('eip155:1/erc721:')[1];
      else stub = potentialAvatar.split('eip155:1/erc1155:')[1];

      if (stub === undefined)
        throw new Error('bad format: "' + potentialAvatar);

      const [contract, tokenId] = stub.split('/');
      const abi = ['function uri(uint256 tokenId) view returns (string value)'];
      const instance = new ethers.Contract(contract, abi, context.web3Provider);

      let decoded;
      try {
        const result = await instance.uri(tokenId);

        const directory = await resolveDirectory(result, fetchImageRef.current);
        fetchImageRef.current = null;
        const files = await directory.files();
        const stream = await files[0].stream().getReader().read();
        decoded = new TextDecoder().decode(stream.value);

        try {
          const json = JSON.parse(decoded);
          let image = json.image;

          //resolve ipns
          if (
            image.indexOf('ipns://') !== -1 ||
            image.indexOf('ipns/') !== -1
          ) {
            if (image.indexOf('ipns/') !== -1) image = image.split('ipns/')[1];

            image = (
              await resolveIPNS(
                image.replace('ipns://', ''),
                fetchImageRef.current
              )
            )
              .replace('ipfs/', 'ipfs://')
              .replace('/ipfs/', 'ipfs://');
          }

          if (image.indexOf('ipfs://') !== -1) {
            const decodedImage = await resolveFile(
              json.image,
              undefined,
              fetchMetadataRef.current
            );
            fetchMetadataRef.current = null;
            return (
              `data:image/${decodedImage.name.split('.').pop()};base64,` +
              Buffer.from(
                (await decodedImage.stream().getReader().read()).value
              ).toString('base64')
            );
          } else return json.image;
        } catch (error) {
          if (error.name === 'AbortError') return;
          console.error(error);
          return decoded;
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error(error);
        return null;
      }
    } else {
      if (
        potentialAvatar.indexOf('http://') === -1 &&
        potentialAvatar.indexOf('https://') === -1
      ) {
        throw new Error('bad format: ' + potentialAvatar);
      }

      return potentialAvatar;
    }
  } catch (error) {
    console.log('bad avatar: ' + error.message);
    return config.defaultAvatar;
  }
};

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
  const fetchMetadataRef = useRef(null);
  const fetchImageRef = useRef(null);

  useEffect(() => {
    if (!context.loaded) return;
    setLoaded(false);

    if (currentEnsAddress === null) {
      setEnsError(new Error('No ENS address provided'));
      return;
    }

    const main = async () => {
      setEnsError(null);
      const resolver = await context.web3Provider.getResolver(
        currentEnsAddress
      );

      if (resolver === null) {
        throw new Error('No resolver found for "' + currentEnsAddress + '"');
      }

      setResolver(resolver);

      // Will kill and make new abort controllers
      if (fetchImageRef.current !== null) fetchImageRef.current.abort();
      fetchImageRef.current = new AbortController();

      if (fetchMetadataRef.current !== null) fetchMetadataRef.current.abort();
      fetchMetadataRef.current = new AbortController();

      setAvatar(
        await prepareAvatar(resolver, context, fetchImageRef, fetchMetadataRef)
      );

      try {
        setEmail(await resolver.getText('email'));
      } catch (error) {
        console.log('bad email: ' + error.message);
        setEmail(null);
      }

      try {
        setOwner(await context.web3Provider.resolveName(currentEnsAddress));
      } catch (error) {
        console.log('bad owner: ' + error.message);
        setOwner(null);
      }

      try {
        setContentHash(await resolver.getContentHash());
      } catch (error) {
        console.log('bad content hash: ' + error.message);
        setContentHash(null);
      }

      console.log('loaded ens: ' + currentEnsAddress);
      setLoaded(true);
    };
    main().catch((error) => {
      setEnsError(error.message);
      setLoaded(true);
    });

    return () => {
      if (fetchImageRef.current !== null) fetchImageRef.current.abort();
      if (fetchMetadataRef.current !== null) fetchMetadataRef.current.abort();
    };
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
