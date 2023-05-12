import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

export const settings = {
	requireLogin: true,
	requireTicket: false,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	let { domainName } = req.body;
	if (!domainName) return userError(res, 'No domain name provided');

	if (await server.prisma.eNS.findUnique({ where: { domainName } })) {
		//update the views
		let totalViews = 0;
		let previous = await server.prisma.stats.findUnique({
			where: { domainName },
		});
		totalViews = previous.totalViews;

		console.log(
			await server.prisma.history.findFirst({
				where: {
					domainName,
					address: req.session.siwe.address,
				},
			})
		);

		if (
			!(await server.prisma.history.findFirst({
				where: {
					domainName,
					address: req.session.siwe.address,
				},
			}))
		) {
			totalViews++;
			await server.prisma.history.create({
				data: {
					address: req.session.siwe.address,
					domainName,
				},
			});
		}

		await server.prisma.stats.upsert({
			where: { domainName },
			update: { totalViews },
			create: {
				totalViews,
				domainName,
			},
		});

		//stop view botting
		if ((await server.redisClient.hGet(req.ip, domainName)) !== 'true') {
			let currentHourlyViews =
				(await server.redisClient.hGet(domainName, 'hourlyViews')) || 0;

			await server.redisClient.hSet(
				'stats',
				domainName,
				(parseInt(currentHourlyViews) + 1).toString()
			);

			await server.redisClient.hSet(
				req.ip,
				domainName,
				'true',
				'EX',
				60 * 1
			);
		}

		return success(res);
	} else
		return userError(
			res,
			'Domain has not been established in magicmirrors database'
		);
};
