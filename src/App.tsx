import React, { useEffect, useRef, useState } from "react";
import AppContextProvider from "./contexts/appContext";
import ENSContextProvider from "./contexts/ensContext";
import IDE from "./pages/IDE";
import Index from "./pages/Index";
import WebEvents from "./webEvents";

const App = (): JSX.Element => {
  return (
    <AppContextProvider>
      <ENSContextProvider>
        <Index />
      </ENSContextProvider>
    </AppContextProvider>
  );
};

export default App;
