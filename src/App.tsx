import React from 'react';
import Web3ContextProvider from './contexts/web3Context';
import ENSContextProvider from './contexts/ensContext';
import IDE from './pages/IDE';
import Index from './pages/Index';
import Viewer from './pages/Viewer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Web3ContextProvider>
      <ENSContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/ide">
              <IDE />
            </Route>
            <Route exact path="/">
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
            <Route path="/🧱/:token">
              <Viewer />
            </Route>
            <Route exact path="*">
              <NotFound />
            </Route>
          </Switch>
        </BrowserRouter>
      </ENSContextProvider>
    </Web3ContextProvider>
  );
}

export default App;
