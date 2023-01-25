import React, { useEffect, useRef, useState } from "react";
import Web3ContextProvider from "./contexts/web3Context";
import ENSContextProvider from "./contexts/ensContext";
import IDE from "./pages/IDE";
import Index from "./pages/Index";
import Viewer from "./pages/Viewer";
import WebEvents from "./webEvents";
import { BrowserRouter, MemoryRouter, Switch, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

const App = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <ENSContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/ide">
              <IDE />
            </Route>
            <Route exact={true} path="/">
              <Index />
            </Route>
            <Route exact path="/index">
              <Index />
            </Route>
            <Route path="/view/:token">
              <Viewer />
            </Route>
            <Route path="/viewer/:token">
              <Viewer />
            </Route>
            <Route exact={true} path="*">
              <NotFound />
            </Route>
          </Switch>
        </BrowserRouter>
      </ENSContextProvider>
    </Web3ContextProvider>
  );
};

export default App;
