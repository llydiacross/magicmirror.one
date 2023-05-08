import { success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let { domainName } = req.query;

	if (!address) return userError(res, 'Missing address');

	let managers = await server.prisma.manager.findMany({
		where: {
			domainName: domainName,
		},
	});

	return success(res, {
		managers,
	});
};
