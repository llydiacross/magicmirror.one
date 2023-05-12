import React, { useEffect, useState } from 'react';
import storage from '../storage';
import config from '../config';
import { apiFetch } from '../api';
import FixedElements from '../components/FixedElements';
import Navbar from '../components/Navbar';

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
			<Navbar />
			<div className="flex flex-row bg-gray-500 pt-4 mb-5">
				<div className="flex flex-col w-2/5 p-2">
					<h1 className="text-3xl md:text-5xl lg:text-6xl text-black text-center md:text-right lg:text-right mb-4">
						Welcome To <u>🔥️1️⃣0️⃣0️⃣.eth</u>
					</h1>
				</div>
				<div className="flex flex-col w-2/5 p-2">
					<p className="text-3xl">
						See whos rising above the stars with our ENS
						Leaderboards!
					</p>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				<div className="flex flex-col w-full">
					{/** Top 100 Domains (All Time) */}
					<div className="flex flex-row justify-center p-2">
						<div className="text-3xl text-center font-bold mt-2">
							Top 100 Domains (All Time)
						</div>
					</div>
					<div className="flex flex-col">
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
											{stats.map(
												(stat: any, index: number) => {
													return (
														<>
															<tr
																className={
																	(index === 0
																		&& 'mix-blend-multiply shadow-md border-2 border-amber-300 shadow-amber-300 animation-pulse'
																	)
																}
																key={index}
															>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		<p>
																			{index + 1}
																			{index === 0
																				&& ' 🏆 '}
																		</p>
																	</div>
																</td>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		{
																			stat.domainName
																		}
																	</div>
																</td>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		{
																			stat.totalViews
																		}
																	</div>
																</td>
															</tr>
														</>
													);
												}
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full">
					{/** Top 100 Domains (Last Hour) */}
					<div className="flex flex-row justify-center p-2">
						<div className="text-3xl text-center font-bold mt-2">
							Top 100 Domains (Hourly)
						</div>
					</div>
					<div className="flex flex-col">
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
											{stats.map(
												(stat: any, index: number) => {
													return (
														<>
															<tr
																className={
																	index ===
																	0 &&
																	'mix-blend-multiply shadow-md border-2 border-amber-300 shadow-amber-300 animation-pulse'
																}
																key={index}
															>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		<p>
																			{index + 1}
																			{index === 0
																				&& ' 🏆 '}
																		</p>
																	</div>
																</td>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		{
																			stat.domainName
																		}
																	</div>
																</td>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		{
																			stat.totalViews
																		}
																	</div>
																</td>
															</tr>
														</>
													);
												}
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full min-h-screen">
					{/** Top 100 Domains (Daily) */}
					<div className="flex flex-row justify-center p-2">
						<div className="text-3xl text-center font-bold mt-2">
							Top 100 Domains (Daily)
						</div>
					</div>
					<div className="flex flex-col">
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
											{stats.map(
												(stat: any, index: number) => {
													return (
														<>
															<tr
																className={
																	index ===
																	0 &&
																	'mix-blend-multiply shadow-md border-2 border-amber-300 shadow-amber-300 animation-pulse'
																}
																key={index}
															>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		<p>
																			{index + 1}
																			{index === 0
																				&& ' 🏆 '}
																		</p>
																	</div>
																</td>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		{
																			stat.domainName
																		}
																	</div>
																</td>
																<td className="px-6 py-4 whitespace-nowrap">
																	<div className="text-sm text-gray-900">
																		{
																			stat.totalViews
																		}
																	</div>
																</td>
															</tr>
														</>
													);
												}
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<FixedElements
				hideSettings={true}
				hideUserInfo={true}
				hideFooter={false}
				hideOwnership
				useFixed={false}
			/>
		</div >
	);
}
