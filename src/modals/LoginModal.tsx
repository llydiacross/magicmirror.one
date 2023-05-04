import React, { useRef, useState, useEffect, useContext } from 'react';
import config from '../config';
import Loading from '../components/Loading';
import WebEvents from '../webEvents';
import storage from '../storage';
import { LoginContext } from '../contexts/loginContext';

export default function LoginModal({ hidden, onLogin, onHide }: any) {
	const [loading, setLoading] = useState(false);
	const [currentTheme, setCurrentTheme] = useState(config.defaultTheme);
	const eventEmitterCallbackRef = useRef(null);
	const loginContext = useContext(LoginContext);

	useEffect(() => {
		if (storage.getGlobalPreference('defaultTheme')) {
			setCurrentTheme(storage.getGlobalPreference('defaultTheme'));
		}

		if (eventEmitterCallbackRef.current === null) {
			eventEmitterCallbackRef.current = () => {
				if (storage.getGlobalPreference('defaultTheme')) {
					setCurrentTheme(
						storage.getGlobalPreference('defaultTheme')
					);
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
			className="mx-auto sm:w-3/5 md:w-3/5 lg:w-4/5 fixed inset-0 flex items-center overflow-y-auto z-50 bg-transparent"
			hidden={hidden}
		>
			<div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
				<div className="flex flex-col w-full">
					{loading ? (
						<div className="bg-white rounded-md w-full overflow-y-auto max-h-screen shadow shadow-lg border-2">
							<div className="flex flex-col w-full">
								<Loading />
							</div>
						</div>
					) : (
						<>
							<div className="bg-blue-400 p-2 text-black text-3xl mb-2">
								<b>🌟</b>
							</div>
							<p className="text-center text-3xl text-black mt-2">
								Login
							</p>
							<p className="text-center text-1xl text-black">
								Login to your account to access awesome features
								such as the property manager and more!
							</p>
							{loginContext.loaded && loginContext.error ? (
								<p className="mt-2 text-center text-2xl text-error">
									{loginContext.error?.message?.includes(
										'user rejected signing'
									)
										? 'You rejected the signature. How could you?'
										: loginContext.error?.message}
								</p>
							) : (
								<></>
							)}
							{loginContext.loaded &&
							loginContext.isIncorrectAddress ? (
								<p className="mt-2 text-center text-2xl text-error">
									You've switched over your address. You'll
									need to login again or switch back to the
									original address you used to login.
								</p>
							) : (
								<></>
							)}
							<div className="flex flex-col gap-2 w-full p-2">
								<button
									className="btn btn-primary"
									onClick={() => {
										setLoading(true);
										onLogin();
									}}
								>
									Login
								</button>
								<button
									className="btn btn-error"
									onClick={() => {
										onHide();
									}}
								>
									Cancel
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
