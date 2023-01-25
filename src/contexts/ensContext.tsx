import React, { createContext } from "react";
import Header from "../components/Header";
import useENSContext from "../effects/useENSContext";

export const ENSContext = createContext({
  resolver: null,
  loaded: false,
  email: "",
  contentHash: "",
  avatar: "",
  ensError: null,
});

const ENSContextProvider = ({ children, ensAddress = null }) => {
  const { resolver, loaded, email, contentHash, avatar, ensError } =
    useENSContext({
      ensAddress: ensAddress,
    });

  return (
    <ENSContext.Provider
      value={{
        resolver,
        email,
        loaded,
        contentHash,
        avatar,
        ensError,
      }}
    >
      {loaded ? (
        <>{children}</>
      ) : (
        <Header theme="dark" title="welcome" showFinder={false} />
      )}
    </ENSContext.Provider>
  );
};
export default ENSContextProvider;
