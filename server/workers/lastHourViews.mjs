import server from '../server.mjs';

//runs every 1 hour, takes the stats from the redis db and saves them to the prisma db
export const settings = {
	runEvery: 60 * 60 * 1000,
};

export const run = async () => {
	let domainStats = await server.redisClient.hGetAll('stats');

	console.log(domainStats);

	for (let domainName in domainStats) {
		let lastHourViews = parseInt(domainStats[domainName]);

		let stats = await server.prisma.stats.findUnique({
			where: { domainName },
		});

		await server.prisma.stats.upsert({
			where: { domainName },
			update: {
				lastHourViews,
				lastDayViews: (stats?.lastDayViews || 0) + lastHourViews,
				totalViews: (stats?.totalViews || 0) + lastHourViews,
			},
			create: {
				lastHourViews,
				lastDayViews: lastHourViews,
				domainName,
				totalViews: lastHourViews,
			},
		});

		await server.redisClient.hSet('stats', domainName, '0');
	}
};
