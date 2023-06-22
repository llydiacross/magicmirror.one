import React from 'react';
// Page Routing
import { withRouter } from 'react-router-dom';
//Storage Controller & Config
import storage from '../storage';
import config from '../config';
import Navbar from '../components/Navbar';

function Mint() {
	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<Navbar />
			<div className="flex flex-row bg-accent pt-4 pb-5">
				<div className="flex flex-col w-2/5 p-2">
					<h1 className="text-3xl md:text-5xl lg:text-6xl text-black text-center md:text-right lg:text-right mb-4">
						<u>Golden 🎫</u>
					</h1>
				</div>
				<div className="flex flex-col w-2/5 p-2">
					<p className="text-3xl text-black">
						Help us help you help us all!
					</p>
				</div>
			</div>
		</div>
	);
}

export default withRouter(Mint);
