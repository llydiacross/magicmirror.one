import React, { useContext, useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import FixedElements from '../components/FixedElements';
import SettingsModal from '../modals/SettingsModal';
import Hero from '../components/Hero';
import { ENSContext } from '../contexts/ensContext';
import WebEvents from '../webEvents';
import storage from '../storage';
import config from '../config';
import { getFastAvatar } from '../helpers';
import { Web3Context } from '../contexts/web3Context';
import UpdateBanner from '../components/UpdateBanner';
import LoginModal from '../modals/LoginModal';
import { LoginContext } from '../contexts/loginContext';

export default function Index() {
	const [shouldShowSettings, setShouldShowSettings] = useState(false);
	const [shouldShowBackdrop, setShouldShowBackdrop] = useState(false);
	const [currentDestination, setCurrentDestination] = useState(null);
	const [shouldShowLogin, setShouldShowLogin] = useState(null);
	const [backgroundImage, setBackgroundImage] = useState(null);
	const ensContext = useContext(ENSContext);
	const context = useContext(Web3Context);
	const loginContext = useContext(LoginContext);
	const cooldown = useRef(null);

	useEffect(() => {
		if (!context.loaded) return;
		if (ensContext.loaded) setBackgroundImage(ensContext.avatar);

		if (cooldown.current === null) {
			cooldown.current = async (destination) => {
				setBackgroundImage('/img/0x0z.jpg');
				let result = await getFastAvatar(
					destination,
					context.web3Provider
				);
				if (result) {
					setBackgroundImage(result);
				}
				setShouldShowBackdrop(true);
				setCurrentDestination(destination);
			};
		}

		// Might cause trouble
		window.scrollTo(0, 0);

		WebEvents.off('gotoDestination', cooldown.current);
		WebEvents.on('gotoDestination', cooldown.current);

		return () => {
			WebEvents.off('gotoDestination', cooldown.current);
		};
	}, [context, ensContext]);
	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'Ox0z_light'
			}
		>
			<UpdateBanner />
			<div
				className="hero-bg w-full h-screen absolute z-0 animate-pulse bg-cover bg-center backdrop-saturate-100 backdrop-opacity-20"
				hidden={!shouldShowBackdrop}
				style={{
					backgroundImage: `url("${backgroundImage}")`,
				}}
			/>
			<div
				className="hero-bg w-full h-screen absolute z-0 overflow-hidden bg-cover bg-center  bg-black"
				hidden={
					!shouldShowBackdrop ||
					ensContext.avatar === null ||
					ensContext.avatar.length === 0
				}
				style={{ opacity: 0.75 }}
			/>
			<Header title={currentDestination} />
		
			<Hero>
				<div className="hero-content text-center w-full bg-info">
					<div className="flex flex-col md:flex-row lg:flex-row gap-2 w-full pt-5">
					
						
						<div className="p-4">
						<p className="text-3xl md:text-5xl lg:text-7xl text-black text-center font-bold mb-4 pb-4">
								MAGIC🪞.ETH
							</p>
							<h4 className="text-3xl md:text-3xl lg:text-4xl text-black font-bold mb-4 pb-4">
							MAGIC🪞 is a self-contained Web3 browser that shows you the future of Web3. It allows the user to view Web3 websites without using proxies or extensions. It is a browser that is built to let you build the future of the internet.
							</h4>
							<p className="text-black text-1xl g:text-2xl text-left mb-3 pb-3">
							This is the Google moment of Web3, and the interface is akin to a search/address bar. If the user inputs an ETH domain like 0x0z.eth, it takes them to the active content tag for that ENS domain. Users don't even need to add the .eth and can also skip right to marketplaces like [ens.vision](http://ens.vision/) by typing 0x0z.vision. And this is just the beginning.
							</p>
							<p className="text-black text-1xl g:text-2xl text-left mb-3 pb-3">
							The 🪞 also features the dream🎨.eth dWeb Studio, the most magical way to create your own decentralized websites and add more power to your Web3 domains.
							</p>
							<p className="text-black text-1xl g:text-2xl text-left mb-3 pb-3">
							Magic🪞.eth is a self-contained Web3 browser that can be instantiated inside of any typical browser. It allows users to view Web3 websites without using proxies such as .link or .limo.
							</p>
							<p className="text-black text-1xl g:text-2xl text-left mb-3 pb-3">
							The interface of this browser is similar to the search/address bar of Google. By inputting an ETH domain such as 0x0z.eth, the user is taken to the active content tag for that ENS domain. Users don't even need to add the .eth and can also skip right to marketplaces such as [ens.vision](http://ens.vision/) by typing 0x0z.vision. This is just the beginning of the possibilities with Magic🪞.eth.
							</p>
							<p className="text-black text-1xl g:text-2xl text-left mb-3 pb-3">
							The 🪞 also features the dream🎨.eth dWeb Studio, which is the most magical way to create your own decentralized websites and add more power to your Web3 domains.
							</p>
						</div>
					</div>
				</div>
			</Hero>
			<Hero>
			<div className="text-center w-full bg-warning">
					<div className="flex flex-col md:flex-row lg:flex-row gap-2 w-full pt-5">
						<div className="lg:pl-5 lg:ml-5 md:pl-2 md:ml-2">
							<p className="text-5xl lg:ml-5 lg:pl-5 md:ml-2 md:pl-2 lg:text-14x xl:text-giant text-black text-center md:text-left xl:text-left">
								FOLLOW THE 0x🟨ROAD
							</p>
						</div>
						<div className="p-4">
							<h1 className="text-3xl md:text-5xl lg:text-7xl text-black text-right font-bold mb-4 pb-4">
								Harness the power of the <u>DEcentralized🌈GENeration</u> to
								create <u>something magical</u>
							</h1>
							<p className="text-black text-1xl lg:text-2xl text-right">
							Who’s the fairest browser  of them all? One that only shows you the true 🪞ReflectionNFT of a Web3 address. .eth.sol.nft.x.next if there is a 🪞we can see each other through we can reset the trust of the internet. Consent based browsing for a reconnecting world.
							</p>
						</div>
					</div>
				</div>
			</Hero>
			{/** Contains the footer and the 0x0zLogo with the console button */}
			<FixedElements
				hideUserInfo={false}
				hideFooter={true}
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
