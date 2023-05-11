import React, { useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import { apiFetch } from '../api';

export default function Leaderboard() {
	const [stats, setStats] = useState({}); //stats returns a object with an array inside it

	useEffect(() => {
		let main = async () => {
			let response = await apiFetch('stats', 'top', {}, 'GET');

			console.log(response);
		};

		main();
	}, []);

	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<div className="container"></div>
		</div>
	);
}
