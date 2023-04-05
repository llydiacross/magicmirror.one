import React, { createContext } from 'react';
import Header from '../components/Header';
import useENSContext from '../effects/useENSContext';

export const ENSContext = createContext({
  resolver: null,
  loaded: false,
  email: '',
  contentHash: '',
  avatar: '',
  owner: '',
  currentEnsAddress: null,
  setCurrentEnsAddress: null,
  ensError: null,
});

// eslint-disable-next-line react/prop-types
const ENSContextProvider = ({ children, ensAddress = null }) => {
  const {
    resolver,
    loaded,
    email,
    contentHash,
    avatar,
    owner,
    ensError,
    currentEnsAddress,
    setCurrentEnsAddress,
  } = useENSContext({
    ensAddress,
  });

  return (
    <ENSContext.Provider
      value={{
        resolver,
        email,
        loaded,
        contentHash,
        owner,
        currentEnsAddress,
        setCurrentEnsAddress,
        avatar,
        ensError,
      }}
    >
      {loaded || (!loaded && ensError !== null) ? (
        <>{children}</>
      ) : (
        <Header
          theme="acid"
          initialText="Estabilishing ENS Link..."
          showFinder={false}
        />
      )}
    </ENSContext.Provider>
  );
};
export default ENSContextProvider;
