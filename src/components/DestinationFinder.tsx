/* eslint-disable no-unused-vars */
import React, { useRef, useState, useContext } from 'react';
import ErrorIcon from './Icons/ErrorIcon';
import WebEvents from '../webEvents';
import { ENSContext } from '../contexts/ensContext';
import { useHistory } from 'react-router-dom';
import { LoginContext } from '../contexts/loginContext';
import config from '../config';

export default function DestinationFinder() {
	const inputElement = useRef(null);
	const ensContext = useContext(ENSContext);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [hasInput, setHasInput] = useState(false);
	const errorRef = useRef(null);
	const history = useHistory();
	const loginContext = useContext(LoginContext);
	const gotoAddress = async (destination: string) => {
		setError(false);
		destination = destination.toString();
		destination = destination.trim();
		// Remove leading and trailing dots
		destination = destination.replace(/^\.+|\.+$/g, '');
		// Remove http:// or https:// from the destination
		if (destination.includes('http://')) {
			destination = destination.replace('http://', '');
		}
		if (destination.includes('https://')) {
			destination = destination.replace('https://', '');
		}
		// Remove html tags from the destination
		destination = destination.replace(/<[^>]*>/g, '');
		// Remove any colons and stuff
		destination = destination.replace(/:|;|\?|\|\*|#/g, '');
		destination = destination.replace(/ /g, '-');
		// Remove leading and trailing spaces
		destination = destination.trim();

		let isResolver = false;
		let resolverExtension = '';
		let resolverActualExtension = '.eth';

		config.resolvers.forEach((resolver) => {
			if (destination.includes(resolver[0])) {
				isResolver = true;
				destination = destination.split('.').slice(0, -1).join('.');
				resolverExtension = resolver[1] || '';
				resolverActualExtension = resolver[0];
			}
		});

		if (destination.length === 0) {
			throw new Error('Please enter a destination to visit!');
		}

		if (destination.length > 100)
			throw new Error('Destination is too long!');

		destination = destination.replace('.eth', '');
		destination = destination + resolverActualExtension;

		if (destination.split('.').pop() === 'eth')
			destination = destination.split('.').slice(0, -1).join('.');

		WebEvents.emit(
			'gotoDestination',
			destination + (isResolver ? resolverExtension : '.eth')
		);

		// Gives time for animations to animates\
		await new Promise((resolve) =>
			setTimeout(() => {
				history.push(
					'/' +
						destination +
						(isResolver ? resolverExtension : '.eth')
				);
				resolve(true);
			}, 4542)
		);
	};

	const errorHandler = (error: any) => {
		setError(error.message);
		// Fade out the error after 5 seconds
		clearTimeout(errorRef.current);
		errorRef.current = setTimeout(() => {
			setError(false);
		}, 10000);
	};

	// Get the current destination from the box and goes to it
	const handleVisit = () => {
		setLoading(true);
		const destination = inputElement.current.value;
		gotoAddress(destination)
			.catch(errorHandler)
			.finally(() => {
				setLoading(false);
			});
	};

	// Pick random tokenId from ENS and try and got to it...
	const handleTakeMeAnywhere = () => {
		setLoading(true);
		gotoAddress(
			config.destinations[
				Math.floor(Math.random() * config.destinations.length)
			]
		)
			.catch(errorHandler)
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="w-full max-w-screen">
			<div className="alert alert-error shadow-lg mb-3" hidden={!error}>
				<div>
					<ErrorIcon />
					<span>
						<b className="mr-2">Error!</b>
						{error}
					</span>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="form-control w-full">
					<div className="input-group w-75">
						<input
							type="text"
							data-loading={loading}
							disabled={loading}
							ref={inputElement}
							maxLength={52}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleVisit();
							}}
							onInput={() => {
								setHasInput(
									inputElement.current.value.length > 0
								);
							}}
							placeholder="Enter a destination..."
							className="input input-bordered w-full"
						/>
						<button
							data-loading={loading}
							disabled={loading || !hasInput}
							className="btn bg-primary w-25 hover:text-white hover:bg-black"
							onClick={handleVisit}
						>
							VISIT
						</button>
					</div>
				</div>
				<button
					className="btn btn-outline bg-light w-full mt-4 sm:mt-2"
					data-loading={loading}
					disabled={loading}
					onClick={handleTakeMeAnywhere}
				>
					TAKE ME ANYWHERE
				</button>
				<p className="text-1xl text-shadow text-white bg-secondary p-1 mt-4 mb-1 lg:block">
					<b>
						👇 build the next <u>web</u> and unlock the magic of
						Web3 👇
					</b>
				</p>
				<button
					className="btn btn-outline bg-light hover:bg-accent-500 w-full mt-4 lg:mt-3 animate-pulse"
					data-loading={loading}
					disabled={loading}
					onClick={() => {
						history.push('/ide');
					}}
				>
					DREAM🎨.ETH STUDIO
				</button>

				{loginContext.isSignedIn ? (
					<>
						<p className="text-2xl text-shadow text-white bg-error p-1 mt-4 mb-1 lg:block">
							<b>👇 🍬Land Landscapers, Meta Real Estate & the Metaverse's most exc	iting Candy Store! 👇</b>
						</p>
						<button
							className="btn btn-outline bg-light hover:bg-accent-500 w-full mt-4 lg:mt-3 animate-pulse"
							data-loading={loading}
							disabled={loading}
							onClick={() => {
								history.push('/properties');
							}}
						>
							🍬LAND.ETH
						</button>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
