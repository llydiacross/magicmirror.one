import React, { useContext, useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import FixedElements from '../components/FixedElements';
import SettingsModal from '../modals/SettingsModal';
import LoginModal from '../modals/LoginModal';
import { Web3Context } from '../contexts/web3Context';
import { LoginContext } from '../contexts/loginContext';
import { apiFetch } from '../api';
import { useHistory } from 'react-router-dom';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';

export default function Properties() {
	const [shouldShowSettings, setShouldShowSettings] = useState(false);
	const [shouldShowLogin, setShouldShowLogin] = useState(null);
	const [ens, setENS] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filterTerm, setFilterTerm] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState(null);
	const [count, setCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [page, setPage] = useState(0);
	const [pageMax, setPageMax] = useState(100);
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
			'GET'
		);

		setENS(result.nfts || []);
		setLoading(false);
	};

	let fetchENS = async () => {
		setLoading(true);
		setError(null);
		await apiFetch(
			'ens',
			'fetch',
			{
				address: context.walletAddress,
			},
			'GET'
		);
		await getAllEns();
		await getCount();
		setLoading(false);
	};

	let searchENS = async () => {
		setLoading(true);
		setError(null);
		await apiFetch(
			'ens',
			'search',
			{
				domainName: searchTerm,
			},
			'GET'
		);

		setLoading(false);
	};

	let getCount = async () => {
		setLoading(true);
		setError(null);
		let result = await apiFetch(
			'ens',
			'count',
			{
				address: context.walletAddress,
			},
			'GET'
		);
		setCount(result.count);
		setTotalPages(result.pages);
		setPageMax(result.pageMax);
		setLoading(false);
		return result.count;
	};

	useEffect(() => {
		if (!context.loaded || !loginContext.loaded) return;
		if (!loginContext.isSignedIn) return;

		let main = async () => {
			let count = await getCount();
			if (count > 0) getAllEns();
			else {
				if (!storage.getPagePreference('firstTime')) {
					await fetchENS();
					storage.setPagePreference('firstTime', true);
				}
			}
		};

		main()
			.catch((err) => {
				console.error(err);
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [context, loginContext]);

	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<Navbar />
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
				<div className="flex flex-col pl-4 md:block">
					<div className="text-3xl text-center font-bold">
						Welcome to 🍬LAND.eth
					</div>
					<div className="text-black bg-info p-6 rounded mt-4">
						🍬LAND.ETH - Web3 Landscaping and Property Management
						Services & the Metaverse's most exciting Candy Store!
						Make sure that your Web3 Property looks as SWEET as
						possible and are ready to become the dream of a
						DEcentralized GENeration.
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-center md:justify-between p-2 mt-5">
				<div className="hidden flex-col pl-4 md:block">
					<div className="text-2xl font-bold">Your Properties</div>
					<div className="text-sm text-gray-500">Total: {count}</div>
				</div>
				<div className="flex flex-row gap-2 pr-0 md:pr-4">
					<input
						disabled={!loginContext.isSignedIn}
						data-loading={loading}
						className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
						id="domain"
						type="text"
						placeholder="🔦 Filter Name..."
						onChange={(e) => {
							setFilterTerm(e.target.value);
						}}
					/>
					<input
						disabled={!loginContext.isSignedIn}
						data-loading={loading}
						className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
						id="domain"
						type="text"
						placeholder="🔎 Search Name..."
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
					<button
						disabled={loading || !loginContext.isSignedIn}
						data-loading={loading}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={async () => {
							fetchENS()
								.catch((error) => {
									setError(error);
								})
								.finally(() => {
									setLoading(false);
								});
							searchENS()
								.catch(err => {
									setError(err)
								})
								.finally(() => {
									setLoading(false)
								})
						}}
					>
						🔄
					</button>
				</div>
			</div>
			{loading ? (
				<div className="p-2">
					<Loading
						showLoadingBar={false}
						loadingReason="Fetching your ENS from the Virtual Web3 Registry."
					/>
				</div>
			) : (
				<>
					<div className="p-2 hidden md:block">
						<div className="divider">
							{context.ensAddresses[0]}
							<span className="bg-alert p-2 text-1">
								{context.walletAddress}
							</span>
						</div>
					</div>
					<div className="grid gap-4 grid-flow-row-dense grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid-rows-3 p-4 mx-auto min-h-screen">
						{ens.length > 0 ? (
							ens.map((item, index) => {
								let filtered = false;
								if (
									filterTerm.length > 0 &&
									!item.domainName
										.toLowerCase()
										.includes(filterTerm.toLowerCase())
								)
									filtered = true;

								return (
									<div
										className="col-span-1 row-span-1 bg-white rounded-lg shadow-lg p-4"
										style={{
											opacity: filtered ? 0.5 : 1,
										}}
										key={index}
									>
										<div className={'flex flex-col' + (item.domainName === searchTerm ? 'border-amber-400' : '')}>
											<div className="text-2xl font-bold text-black">
												{item.domainName.length > 18 ? (
													<>
														{item.domainName.substring(
															0,
															18
														)}
														...
													</>
												) : (
													<>{item.domainName}</>
												)}
												{item.imported ? (
													<span className="ms-2 badge bg-error text-black">
														Imported
													</span>
												) : null}
												{item.manager ? (
													<span className="ms-2 badge bg-error text-black">
														Manager
													</span>
												) : null}
											</div>
											<div className="text-sm text-gray-500 break-all hidden lg:block">
												{item.nftDescription &&
													item.nftDescription.length >
													28 ? (
													<div>
														{item.nftDescription.substring(
															0,
															28
														)}
														...
													</div>
												) : (
													<div>
														{item.nftDescription}
													</div>
												)}
												{!item.nftDescription ? (
													<div>⚪️</div>
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
													title="Buidl a page with Dream🎨.eth"
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
													🖌.DREAM🎨.ETH
												</button>
												<button
													hidden={
														!item.domainName.includes(
															'Untitled ENS Token'
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
								{loginContext.isSignedIn && ens.length === 0 ? (
									<div className='col-span-1 md:col-span-2 lg:col-span-5 row-span-1'>
										<div className='flex flex-col justify-center'>
											<h2 className="text-2xl font-bold">
												No results found from our API!
											</h2>
											<p className='text-sm text-gray-500 text-center'>
												Our API could not find the entry you specified! D:
												You may either have to wait a while for it to update
												or just try again?
											</p>
										</div>
									</div>
								) : (
									<></>
								)}
								{loginContext.isSignedIn ? (
									<div className="col-span-1 md:col-span-3 lg:col-span-5 row-span-1">
										<div className="flex flex-col justify-center items-center">
											<div className="text-2xl font-bold">
												No ENS addresses found!
											</div>
											<div className="text-sm text-gray-500 text-center">
												We use an external API to
												collect your mints which can
												sometimes render innaccurately.
												Please be aware that this only
												shows{' '}
												<u>
													ENS properties that you own!
												</u>
												<br />
												Tap the 'Fetch' button next to
												the search bar to fetch your ENS
												properties.
											</div>
											<div className="flex flex-row gap-2 mt-2">
												<button
													disabled={
														loading ||
														!loginContext.isSignedIn
													}
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => {
														fetchENS()
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
													Fetch
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
												You will need to login to load
												all of your properties so that
												you can let the 🍬LAND.eth
												Landscaping Service get to work
												for you DEGEN!
											</div>
											<button
												className="bg-success text-white font-bold py-2 px-4 rounded mt-2"
												onClick={() => {
													setShouldShowLogin(true);
												}}
											>
												Login 🔑
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</>
			)
			}

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
		</div >
	);
}
