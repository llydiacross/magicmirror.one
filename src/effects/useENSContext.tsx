import { ethers } from 'ethers';
import { useState, useEffect, useContext, useRef, Ref } from 'react';
import config from '../config';
import { Web3Context, Web3ContextType } from '../contexts/web3Context';
import { resolveDirectory, resolveFile, resolveIPNS } from '../ipfs';
import { Buffer } from 'buffer';

const prepareAvatar = async (
  resolver: ethers.providers.Resolver,
  context: Web3ContextType,
  imageAbortController: {
    current: AbortController | null;
  },
  metadataAbortController: {
    current: AbortController | null;
  }
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
          imageAbortController.current
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
        //resolve this directory using our provider
        const directory = await resolveDirectory(
          result,
          imageAbortController.current
        );
        imageAbortController.current = null;
        //if we have a directory, for now we will simply treat the first file as the image

        let files = [...directory.files].filter((file) => {
          if (!file.name) return;
          console.log(file);
          return file.name.toLowerCase().includes('.');
        });

        let json = files.find((file) =>
          file.name?.toLowerCase()?.endsWith('.json')
        );

        if (!json) {
          json = directory.files[0];
        }

        if (!json)
          throw new Error(
            'no json file in directory or dir has multiple files and is considered unsafe'
          );

        const stream = await json.content.getReader().read();
        decoded = new TextDecoder().decode(stream.value);
        console.log(decoded);

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
                imageAbortController.current
              )
            )
              .replace('ipfs/', 'ipfs://')
              .replace('/ipfs/', 'ipfs://');
          }

          if (image.indexOf('ipfs://') !== -1) {
            //resolve this file using our IPFS provider
            const decodedImage = await resolveFile(
              json.image,
              undefined,
              metadataAbortController.current
            );
            metadataAbortController.current = null;
            return (
              `data:image/${decodedImage.name.split('.').pop()};base64,` +
              Buffer.from(
                (await decodedImage.content.getReader().read()).value
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

  // Abort controllers
  const fetchMetadataAbortController = useRef(null);
  const fetchImageAbortController = useRef(null);

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
      if (fetchImageAbortController.current !== null)
        fetchImageAbortController.current.abort();
      fetchImageAbortController.current = new AbortController();

      if (fetchMetadataAbortController.current !== null)
        fetchMetadataAbortController.current.abort();
      fetchMetadataAbortController.current = new AbortController();

      setAvatar(
        await prepareAvatar(
          resolver,
          context,
          fetchImageAbortController,
          fetchMetadataAbortController
        )
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
        let hash = await resolver.getContentHash();

        if (!hash) {
          setContentHash(null);
        } else {
          //if hash has IPNS in it, resolve it
          if (hash.indexOf('ipns://') !== -1) {
            hash = await resolveIPNS(
              hash.replace('ipns://', ''),
              fetchImageAbortController.current
            );
          }

          setContentHash(hash);
        }
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
      if (fetchImageAbortController.current !== null)
        fetchImageAbortController.current.abort();
      if (fetchMetadataAbortController.current !== null)
        fetchMetadataAbortController.current.abort();
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
