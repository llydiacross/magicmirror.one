import server from '../server.mjs';

//runs every 1 hour, takes the stats from the redis db and saves them to the prisma db
export const settings = {
	runEvery: 60 * 60 * 1000,
};

export const run = async () => {
	let domainStats = await server.redisClient.hGetAll();
};
