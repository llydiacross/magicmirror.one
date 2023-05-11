import React, { useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import { apiFetch } from '../api';
import FixedElements from '../components/FixedElements';

export default function Leaderboard() {
	const [stats, setStats] = useState([]); //stats returns a object with an array inside it

	useEffect(() => {
		let main = async () => {
			let response = await apiFetch('stats', 'top', {}, 'GET');

			setStats(Object.values(response));
		};

		main();
	}, []);

	return (
		<div
			data-theme={
				storage.getGlobalPreference('defaultTheme') ||
				config.defaultTheme ||
				'forest'
			}
		>
			<div className="flex flex-row justify-center md:justify-between p-2">
				<div className="flex flex-col pl-4 md:block w-full">
					<div className="text-3xl text-center font-bold mt-2">
						The Leaderboards
					</div>
					<div className="text-black bg-info p-6 rounded mt-4">
						See who is the sexiest in the entire of Web3.
					</div>
				</div>
			</div>
			<div className="flex flex-col min-h-screen">
				<div className="overflow-x-auto p-5">
					<div className="py-2 align-middle inline-block min-w-full">
						<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Rank
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Domain Name
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Total Views
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{stats.map((stat: any, index: number) => {
										return (
											<>
												<tr
													className={index === 0 && 'mix-blend-multiply shadow-md border-2 border-amber-300 shadow-amber-300 animation-pulse'}
													key={index}>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															<p>{index === 0 && ' 🏆 '}{index + 1}</p>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{stat.domainName}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{stat.totalViews}
														</div>
													</td>
												</tr>
											</>
										);
									})}
								</tbody >
							</table>
						</div>
					</div>
				</div>
			</div>

			<FixedElements />
		</div>
	);
}
