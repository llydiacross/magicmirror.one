import React, { useContext, useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import Navbar from '../components/Navbar';
import { useHistory, withRouter } from 'react-router-dom';
import { apiFetch } from '../api';
import Loading from '../components/Loading';
import { LoginContext } from '../contexts/loginContext';
import LoginModal from '../modals/LoginModal';
import { Web3Context } from '../contexts/web3Context';
import FixedElements from '../components/FixedElements';
import SettingsModal from '../modals/SettingsModal';

function VirtualRegistry({ match }) {
	const history = useHistory();
	const loginContext = useContext(LoginContext);
	const context = useContext(Web3Context);
	const [error, setError] = useState(null);
	const [shouldShowLogin, setShouldShowLogin] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasChanges, setHasChanges] = useState(false);
	const [isApproved, setIsApproved] = useState(false);
	const [virtualRegistry, setVirtualRegistry] = useState(null);
	const [shouldShowSettings, setShouldShowSettings] = useState(false);
	const {
		params: { domain },
	} = match;

	const save = async () => {};

	useEffect(() => {
		if (!domain) return;

		let main = async () => {
			if (!loginContext.loaded) return;

			if (!loginContext.isSignedIn) {
				setError(new Error('You must be signed in to view this page'));
				return;
			}

			let approval = await apiFetch(
				'ens',
				'approved',
				{ domainName: domain, address: loginContext.address },
				'GET'
			);

			if (!approval.ok)
				return setError(
					approval.error || approval.message || 'Unknown Error'
				);

			if (approval.approved) setIsApproved(true);

			try {
				let result = await apiFetch(
					'registry',
					'get',
					{ domainName: domain },
					'GET'
				);

				if (!result.ok)
					return setError(
						result.error || result.message || 'Unknown Error'
					);

				setVirtualRegistry(result.fakeRegistry);
			} catch (error) {
				//ignore error
				setVirtualRegistry(null);
			}
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
					<div
						className="flex flex-row w-1/2 justify-content-center mx-auto mt-4"
						hidden={!hasChanges || !isApproved}
					>
						<div className="flex flex-col w-full p-2">
							<button
								className="btn btn-primary"
								onClick={() => {
									setLoading(true);
									save()
										.catch((e) => {
											setError(
												e.message || 'Unknown Error'
											);
										})
										.finally(() => {
											setLoading(false);
										});
								}}
							>
								Save
							</button>
						</div>
					</div>
					<div className="flex flex-col w-1/2 justify-content-center mx-auto mt-2 mb-2 p-2">
						<div className="py-2 align-middle inline-block min-w-full bg-white">
							{Object.values(config.fakeRegistryFields).map(
								(val, index) => {
									return (
										<div className="flex flex-row p-2">
											<div className="flex flex-col w-1/2 p-2">
												<label className="text-2xl text-black">
													<span
														className={
															'badge ' +
															(virtualRegistry?.[
																val
															]
																? 'bg-success'
																: 'bg-error')
														}
													>
														{index}
													</span>{' '}
													{val}
												</label>
											</div>
											<div className="flex flex-col w-1/2 p-2">
												<input
													className="text-2xl input input-bordered w-full"
													placeholder="?"
													onChange={(event) => {
														let _vr = {};
														if (virtualRegistry)
															_vr = {
																...virtualRegistry,
															};

														_vr[val] =
															event.target.value;
														setHasChanges(true);
														setVirtualRegistry(_vr);
													}}
													value={
														virtualRegistry?.[
															val
														] || ''
													}
												/>
											</div>
										</div>
									);
								}
							)}
						</div>
					</div>
					<div
						className="flex flex-row w-1/2 justify-content-center mx-auto mb-4"
						hidden={!hasChanges || !isApproved}
					>
						<div className="flex flex-col w-full p-2">
							<button
								className="btn btn-primary"
								onClick={() => {
									setLoading(true);
									save()
										.catch((e) => {
											setError(
												e.message || 'Unknown Error'
											);
										})
										.finally(() => {
											setLoading(false);
										});
								}}
							>
								Save
							</button>
						</div>
					</div>
					<div className="flex flex-row w-1/2 justify-content-center mx-auto mb-4">
						<div className="flex flex-col w-full p-2">
							<button
								className="btn btn-warning"
								onClick={() => {
									history.goBack();
								}}
							>
								Back
							</button>
						</div>
					</div>
				</>
			)}
			{/** Contains the footer and the 0x0zLogo with the console button */}
			<FixedElements
				hideSettings={true}
				hideUserInfo={true}
				hideFooter={false}
				hideOwnership
				useFixed={false}
				onSettings={() => {
					setShouldShowSettings(!shouldShowSettings);
				}}
			/>
			<SettingsModal
				hidden={!shouldShowSettings}
				onHide={() => {
					setShouldShowSettings(false);
				}}
			/>
			<LoginModal
				hidden={
					shouldShowLogin !== null
						? !shouldShowLogin
						: loginContext.isSignedIn || !context.walletConnected
				}
				onHide={() => {
					setShouldShowLogin(false);
				}}
				onLogin={async () => {
					await loginContext.login();
				}}
			/>
		</div>
	);
}

export default withRouter(VirtualRegistry);
