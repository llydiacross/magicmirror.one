import React, { useContext, useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import FixedElements from '../components/FixedElements';
import SettingsModal from '../modals/SettingsModal';
import LoginModal from '../modals/LoginModal';
import { Web3Context } from '../contexts/web3Context';
import { LoginContext } from '../contexts/loginContext';
import { apiFetch } from '../api';
import Hero from '../components/Hero';
import { useHistory } from 'react-router-dom';
import Loading from '../components/Loading';

export default function Properties() {
	const [shouldShowSettings, setShouldShowSettings] = useState(false);
	const [shouldShowLogin, setShouldShowLogin] = useState(null);
	const [ens, setENS] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState(null);
	const [count, setCount] = useState(0);
	const context = useContext(Web3Context);
	const history = useHistory();
	const loginContext = useContext(LoginContext);

	let getAllEns = async () => {
		setLoading(true);
		setError(null);
		let result = await apiFetch(
			'ens',
			'all',
			{
				address: context.walletAddress,
			},
			'POST'
		);

		console.log(result);

		if (
			context.ensAddresses &&
			result.nfts &&
			result.nfts.length === 0 &&
			context.ensAddresses.length !== 0 &&
			context.ensAddresses[0] !== null
		)
			result.nfts = context.ensAddresses.map((address) => ({
				domainName: address,
				nftMedia: [{ raw: '/img/0x0zLogo.jpg' }],
				nftDescription:
					'This is your default domain. It has been auto-imported for you!',
			}));

		setENS(result.nfts || []);
		setCount(result.nfts?.length || 0);
	};

	let fetchENS = async () => {
		setLoading(true);
		setError(null);
		let result = await apiFetch('ens', 'fetch', null, 'POST');
		setCount(result.totalCount);
	};

	useEffect(() => {
		if (!context.loaded || !loginContext.loaded) return;
		if (!loginContext.isSignedIn) return;
		try {
			getAllEns();
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	}, [context, loginContext]);

	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 bg-gray-700 p-2">
				<div className="max-w-3xl mx-auto text-black">
					<div className="flex flex-row justify-center gap-2">
						<button
							className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => {
								history.push('/');
							}}
						>
							Home
						</button>
						<button
							className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => {
								history.push('/');
							}}
						>
							Utilities
						</button>
						<button
							className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => {
								history.push('/ide');
							}}
						>
							DREAM🎨.ETH STUDIO
						</button>
					</div>
				</div>
			</div>
			{error ? (
				<div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 bg-error p-2">
					<div className="max-w-3xl mx-auto text-black">
						<div className="text-center">
							<h2 className="text-3xl font-extrabold">Error</h2>
							<p className="mt-2 text-lg">
								{error?.message || 'Please try again later...'}
							</p>
						</div>
					</div>
				</div>
			) : null}
			<div className="flex flex-row justify-center md:justify-between p-2 mt-5">
				<div className="flex flex-col pl-4 hidden md:block">
					<div className="text-2xl font-bold">Your Properties</div>
					<div className="text-sm text-gray-500">
						Total:{' '}
						{count === 0 &&
						context?.ensAddresses?.length !== 0 &&
						context?.ensAddresses[0] !== null
							? context?.ensAddresses?.length
							: count}
					</div>
				</div>
				<div className="flex flex-row gap-2 pr-0 md:pr-4">
					<input
						disabled={!loginContext.isSignedIn}
						className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
						id="domain"
						type="text"
						placeholder="Search"
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
					<button
						disabled={loading || !loginContext.isSignedIn}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => {
							history.push('/ens/new');
						}}
					>
						Add
					</button>
					<button
						disabled={loading || !loginContext.isSignedIn}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={async () => {
							fetchENS()
								.catch((error) => {
									setError(error);
								})
								.finally(() => {
									setLoading(false);
								});
						}}
					>
						Fetch
					</button>
				</div>
			</div>
			{loading ? (
				<div className="p-2">
					<Loading showLoadingBar={false} />
				</div>
			) : (
				<>
					<div className="p-2 hidden md:block">
						<div className="divider">{context.walletAddress}</div>
					</div>
					<div className="grid gap-4 grid-flow-row-dense grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid-rows-3 p-4 mx-auto min-h-screen">
						{ens.length > 0 ? (
							ens.map((item, index) => {
								if (
									searchTerm.length > 0 &&
									!item.domainName
										.toLowerCase()
										.includes(searchTerm.toLowerCase())
								)
									return null;

								return (
									<div
										className="col-span-1 row-span-1 bg-white rounded-lg shadow-lg p-4"
										key={index}
									>
										<div className="flex flex-col">
											<div className="text-2xl font-bold text-black">
												{item.domainName.length > 20 ? (
													<div>
														{item.domainName.substring(
															0,
															20
														)}
														...
													</div>
												) : (
													<div>{item.domainName}</div>
												)}
											</div>
											<div className="text-sm text-gray-500 break-all">
												{item.nftDescription &&
												item.nftDescription.length >
													32 ? (
													<div>
														{item.nftDescription.substring(
															0,
															32
														)}
														...
													</div>
												) : (
													<div>
														{item.nftDescription}
													</div>
												)}
												{!item.nftDescription ? (
													<div>
														No description
														available...
													</div>
												) : null}
											</div>
											{item.nftMedia ? (
												<img
													src={
														item.nftMedia[0]?.raw ||
														'/img/0x0zLogo.jpg'
													}
													alt="avatar"
													className="mt-2 border-2 border-gray-500 rounded-lg"
												/>
											) : null}

											<div className="flex flex-row gap-2 mt-2">
												<button
													hidden={item.domainName.includes(
														'Untitled Token'
													)}
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => {
														history.push(
															`/ide?url=${item.domainName}`
														);
													}}
												>
													Open In DREAM🎨.ETH STUDIO
												</button>
												<button
													hidden={
														!item.domainName.includes(
															'Untitled Token'
														)
													}
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => {
														history.push(
															`/ide?url=${item.domainName}`
														);
													}}
												>
													Fix
												</button>
												<button
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => {
														history.push(
															`/ide?url=${item.domainName}`
														);
													}}
												>
													Inspect
												</button>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<>
								{loginContext.isSignedIn ? (
									<div className="col-span-1 md:col-span-3 lg:col-span-5 row-span-1">
										<div className="flex flex-col justify-center items-center">
											<div className="text-2xl font-bold">
												No ENS addresses found
											</div>
											<div className="text-sm text-gray-500">
												We use an external API to
												collect your mints which can
												sometimes be incorrect. If you
												are sure that your current
												wallet address has mints, please
												click the add button below to
												add a custom ENS address to your
												portfolio.
											</div>
											<div className="flex flex-row gap-2 mt-2">
												<button
													disabled={
														loading ||
														!loginContext.isSignedIn
													}
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => {
														getAllEns()
															.catch((error) => {
																setError(error);
															})
															.finally(() => {
																setLoading(
																	false
																);
															});
													}}
												>
													Refresh
												</button>
												<button
													disabled={
														loading ||
														!loginContext.isSignedIn
													}
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => {}}
												>
													Add
												</button>
											</div>
										</div>
									</div>
								) : (
									<div className="col-span-1 md:col-span-3 lg:col-span-5 row-span-1">
										<div className="flex flex-col justify-center items-center">
											<div className="text-2xl font-bold">
												Please Login To View Your
												Properties
											</div>
											<div className="text-sm text-gray-500">
												You will need to login to view
												all of your properties. If you
												do not have an account.
											</div>
											<button
												className="bg-success text-white font-bold py-2 px-4 rounded mt-2"
												onClick={() => {
													setShouldShowLogin(true);
												}}
											>
												Login
											</button>
										</div>
									</div>
								)}
							</>
						)}
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
