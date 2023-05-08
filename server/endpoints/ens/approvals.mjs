import { success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let { domainName } = req.query;

	let nonAccepted = await server.prisma.manager.count({
		where: {
			domainName: domainName,
			accepted: false,
		},
	});
	let accepted = await server.prisma.manager.count({
		where: {
			domainName: domainName,
			accepted: true,
		},
	});

	return success(res, {
		nonAccepted,
		accepted,
	});
};
