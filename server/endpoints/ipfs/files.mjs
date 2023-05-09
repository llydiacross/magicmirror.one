import { isLoggedIn, success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	let { cid, domainName } = req.body;
	let links = [];

	if (!cid) return userError(res, 'No CID');

	try {
		for await (const link of server.ipfs.ls(cid)) {
			if (links.length > 32) break;

			if (link.type === 'file') {
				const stats = await server.ipfs.object.stat(link.path);
				link.size = stats.CumulativeSize;

				if (!link.name) continue;

				const extension = link.name.split('.').pop();

				if (
					!server?.config?.magicMirror.allowedExtensions?.includes(
						extension
					)
				)
					continue;

				if (link.size < 1024 * 1024 * 10) {
					const resp = server.ipfs.cat(link.path);
					let content = [];
					for await (const chunk of resp) {
						content = [...content, ...chunk];
					}
					link.content = content;
				}
				links.push(link);
				continue;
			}

			// is dir
			links.push(link);
		}
	} catch (error) {
		console.log(error);
		return userError(res, 'Bad CID');
	}

	if (
		domainName &&
		(await server.prisma.eNS.findUnique({ where: { domainName } }))
	) {
		let totalViews = 0;
		let previous = await server.prisma.stats.findUnique({
			where: { domainName },
		});

		if (previous) totalViews = previous.totalViews + 1;

		//only update the prisma db is the user is logged in
		if ((await isLoggedIn(req, server)) === true) {
			//update the history table
			if (
				!(await server.prisma.history.findUnique({
					where: { domainName },
				}))
			)
				await server.prisma.history.create({
					data: {
						domainName,
						address: req.session.siwe.address,
					},
				});
			else
				await server.prisma.history.update({
					where: { domainName },
					data: {
						address: req.session.siwe.address,
					},
				});

			//update the stats table
			await server.prisma.stats.upsert({
				where: { domainName },
				update: { totalViews },
				create: {
					totalViews,
					domainName,
				},
			});
		}

		//stop view botting
		if (!(await server.redisClient.hGet(req.ip, domainName))) {
			let currentHourlyViews =
				(await server.redisClient.hGet(domainName, 'hourlyViews')) || 0;

			await server.redisClient.hSet(
				'stats',
				domainName,
				parseInt(currentHourlyViews) + 1
			);

			await server.redisClient.hSet(
				req.ip,
				domainName,
				true,
				'EX',
				60 * 1
			);
		}
	}

	success(res, {
		cid,
		files: links,
	});
};
