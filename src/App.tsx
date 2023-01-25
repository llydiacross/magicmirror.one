import React, { useEffect, useRef, useState } from "react";
import Web3ContextProvider from "./contexts/web3Context";
import ENSContextProvider from "./contexts/ensContext";
import IDE from "./pages/IDE";
import Index from "./pages/Index";
import Viewer from "./pages/Viewer";
import WebEvents from "./webEvents";

const App = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <ENSContextProvider ensAddress={"0x0z.eth"}>
        <Viewer />
      </ENSContextProvider>
    </Web3ContextProvider>
  );
};

export default App;
