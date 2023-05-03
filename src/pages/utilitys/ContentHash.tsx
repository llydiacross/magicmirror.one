import FixedElements from '../../components/FixedElements';
import { useHistory } from 'react-router-dom';
import contentHash from 'content-hash';
export default function ContentHash() {
	const history = useHistory();

	console.log(
		contentHash.decode(
			'0xe50101720024080112207b309057dfacad7811a44f60007ad2b56fe83153ff31e4ec6f95d8a9a77390d4'
		)
	);

	return (
		<>
			<div className="hero min-h-screen">
				<div className="hero-overlay bg-opacity-60" />
				<div className="hero-content text-center text-neutral-content bg-error">
					<div className="max-w-md">
						<h1 className="mb-5 text-5xl font-bold text-black">
							Content Hash Decoder
						</h1>
						<p className="mb-5 text-black">
							Please enter a content hash to decode
						</p>
						<button
							className="btn btn-dark w-full"
							onClick={() => {
								history.push('/');
							}}
						>
							Home
						</button>
					</div>
				</div>
			</div>
			<FixedElements
				hideAlerts
				hideOwnership
				hideSettings
				hideUserInfo
				useFixed={false}
			></FixedElements>
		</>
	);
}
