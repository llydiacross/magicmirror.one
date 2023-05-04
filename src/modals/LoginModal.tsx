import React, { useRef, useState, useEffect } from 'react';
import config from '../config';
import Loading from '../components/Loading';
import WebEvents from '../webEvents';
import storage from '../storage';

export default function LoginModal({ hidden, onLogin, onHide }) {
	const [loading, setLoading] = useState(false);
	const [currentTheme, setCurrentTheme] = useState(config.defaultTheme);
	const eventEmitterCallbackRef = useRef(null);

	useEffect(() => {
		if (storage.getGlobalPreference('defaultTheme')) {
			setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
		}

		if (eventEmitterCallbackRef.current === null) {
			eventEmitterCallbackRef.current = () => {
				if (storage.getGlobalPreference('defaultTheme')) {
					setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
				}
			};
		}

		WebEvents.off('reload', eventEmitterCallbackRef.current);
		WebEvents.on('reload', eventEmitterCallbackRef.current);

		return () => {
			WebEvents.off('reload', eventEmitterCallbackRef.current);
		};
	}, []);

	// Disables scrolling while this modal is active
	useEffect(() => {
		if (!hidden) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'auto';
	}, [hidden]);
	return (
		<div
			data-theme={currentTheme}
			className="mx-auto sm:w-3/5 md:w-3/5 lg:w-4/5 fixed inset-0 flex items-center overflow-y-auto z-50 bg-transparent"
			hidden={hidden}
		>
			{loading ? (
				<div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
					<div className="flex flex-col w-full">
						<Loading />
					</div>
				</div>
			) : (
				<>
					<div className="bg-pink-400 p-2 text-black text-3xl mb-2">
						<b>🌟</b>
					</div>
					<p className="text-center text-3xl text-black">
						Login to your account with Sign In With Ethereum
					</p>
				</>
			)}
		</div>
	);
}
