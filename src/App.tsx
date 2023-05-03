import React from 'react';
import Web3ContextProvider from './contexts/web3Context';
import ENSContextProvider from './contexts/ensContext';
import IDE from './pages/IDE';
import Index from './pages/Index';
import Viewer from './pages/Viewer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import { AuthContextProvider } from './contexts/AuthContext';
import Converter from './pages/utilitys/Converter';
import ContentHash from './pages/utilitys/ContentHash';
import NameHash from './pages/utilitys/NameHash';
import Dashboard from './pages/utilitys/Dashboard';
import ENSLookup from './pages/utilitys/ENSLookup';

function App() {
	return (
		<AuthContextProvider>
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
							<Route exact path="/utilitys/converter">
								<Converter />
							</Route>
							<Route exact path="/utilitys/contenthash">
								<ContentHash />
							</Route>
							<Route exact path="/utilitys/ens">
								<ENSLookup />
							</Route>
							<Route exact path="/utilitys/">
								<Dashboard />
							</Route>
							<Route exact path="/utilitys/namehash">
								<NameHash />
							</Route>
							<Route exact path="*">
								<NotFound />
							</Route>
						</Switch>
					</BrowserRouter>
				</ENSContextProvider>
			</Web3ContextProvider>
		</AuthContextProvider>
	);
}

export default App;
