import FixedElements from '../../components/FixedElements';
import { useHistory } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ethers } from 'ethers';

export default function Dashboard() {
	const history = useHistory();

	const hash = useRef(null);
	const [decoded, setDecoded] = useState('');
	const [error, setError] = useState(null);
	const decode = () => {
		setError(null);
		try {
			if (hash.current.value === '')
				throw new Error('please enter a dns domain');

			const decoded = ethers.utils.namehash(hash.current.value);
			setDecoded(decoded);
		} catch (e) {
			console.log(e);
			setError(e);
		}
	};

	return (
		<>
			<div className="hero min-h-screen">
				<div className="hero-overlay bg-opacity-60" />
				<div className="hero-content text-center text-neutral-content bg-gray-500">
					<div className="min-w-screen">
						<h1 className="mb-5 text-5xl font-bold text-black">
							Utility Dashboard
						</h1>
						<p className="mb-5 text-black">
							Heres a list of utilities you can use
						</p>

						<button
							className="btn btn-dark w-full"
							onClick={() => {
								history.push('/utilities/namehash');
							}}
						>
							Name Hash
						</button>
						<button
							className="btn btn-dark w-full mt-2"
							onClick={() => {
								history.push('/utilities/contenthash');
							}}
						>
							Content Hash
						</button>
						<button
							className="btn btn-dark w-full mt-2"
							onClick={() => {
								history.push('/utilities/ens');
							}}
						>
							ENS WHOIS
						</button>
						<button
							className="btn btn-dark w-full mt-2"
							onClick={() => {
								history.push('/utilities/converter');
							}}
						>
							UTF8 Bytes / String Converter
						</button>
						<button
							className="btn btn-dark w-full mt-2"
							onClick={() => {
								history.push('/');
							}}
						>
							Home
						</button>
					</div>
				</div>
			</div>
			<FixedElements useFixed={false}></FixedElements>
		</>
	);
}
