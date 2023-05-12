import server from '../server.mjs';

//runs every 1 hour, takes the stats from the redis db and saves them to the prisma db
export const settings = {
	runEvery: 60 * 60 * 24 * 1000,
};

export const run = async () => {
	//loop through all the ENS records and set lastDayViews to 0
	let ens = await server.prisma.eNS.findMany();
	for (let record of ens) {
		await server.prisma.eNS.update({
			where: { domainName: record.domainName },
			data: { lastDayViews: 0 },
		});
	}
};
