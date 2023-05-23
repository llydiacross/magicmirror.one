import React, { useContext, useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import Navbar from '../components/Navbar';
import { useHistory, withRouter } from 'react-router-dom';
import { apiFetch } from '../api';
import Loading from '../components/Loading';
import { LoginContext } from '../contexts/loginContext';

function VirtualRegistry({ match }) {
	const history = useHistory();
	const loginContext = useContext(LoginContext);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isApproved, setIsApproved] = useState(false);
	const [virtualRegistry, setVirtualRegistry] = useState(null);
	const {
		params: { domain },
	} = match;

	useEffect(() => {
		if (!domain) return;

		let main = async () => {
			if (!loginContext.loaded) return;

			if (!loginContext.isSignedIn) {
				setError(new Error('You must be signed in to view this page'));
				return;
			}

			let approval = await apiFetch(
				'registry',
				'approved',
				{ domain, address: loginContext.address },
				'GET'
			);

			if (!approval.ok)
				return setError(
					approval.error || approval.message || 'Unknown Error'
				);

			if (approval.approved) setIsApproved(true);

			let result = await apiFetch('registry', 'get', { domain }, 'GET');

			if (!result.ok)
				return setError(
					result.error || result.message || 'Unknown Error'
				);

			setVirtualRegistry(result.fakeRegistry);
		};
		main()
			.catch((e) => {
				setError(e.message || 'Unknown Error');
			})
			.finally(() => {
				setLoading(false);
			});
	}, [domain, loginContext]);

	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<Navbar />

			{loading ? (
				<Loading />
			) : (
				<>
					<div className="flex flex-row bg-gray-500 pt-4 pb-5">
						<div className="flex flex-col w-2/5 p-2">
							<h1 className="text-3xl md:text-5xl lg:text-6xl text-black text-center md:text-right lg:text-right mb-4">
								Virtual Registry for <u>{domain}</u>
							</h1>
						</div>
						<div className="flex flex-col w-2/5 p-2">
							<p className="text-3xl">
								Your virutal registry is your way to control
								which content hash for magic mirror to use for
								your domain
							</p>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default withRouter(VirtualRegistry);
