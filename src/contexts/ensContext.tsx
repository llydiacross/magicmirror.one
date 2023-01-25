import React, { createContext } from "react";
import Header from "../components/Header";
import useENSContext from "../effects/useENSContext";

export const ENSContext = createContext({
  resolver: null,
  loaded: false,
  email: "",
  contentHash: "",
  avatar: "",
  currentEnsAddress: null,
  setCurrentEnsAddress: null,
  ensError: null,
});

const ENSContextProvider = ({ children, ensAddress = null }) => {
  const {
    resolver,
    loaded,
    email,
    contentHash,
    avatar,
    ensError,
    currentEnsAddress,
    setCurrentEnsAddress,
  } = useENSContext({
    ensAddress: ensAddress,
  });

  return (
    <ENSContext.Provider
      value={{
        resolver,
        email,
        loaded,
        contentHash,
        currentEnsAddress,
        setCurrentEnsAddress,
        avatar,
        ensError,
      }}
    >
      {loaded ? (
        <>{children}</>
      ) : (
        <Header
          theme="dark"
          initialText="Estabilishing ENS Link..."
          showFinder={false}
        />
      )}
    </ENSContext.Provider>
  );
};
export default ENSContextProvider;
