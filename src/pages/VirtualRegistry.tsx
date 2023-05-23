import React from 'react';
import storage from '../storage';
import config from '../config';
import Navbar from '../components/Navbar';

export default function VirtualRegistry() {
	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<Navbar />
		</div>
	);
}
