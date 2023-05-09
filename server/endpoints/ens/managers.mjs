import { success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let { domainName, accepted } = req.query;
	if (accepted !== undefined) accepted = accepted === 'true' ? true : false;
	if (!domainName) return userError(res, 'No domain name');

	let managers = await server.prisma.manager.findMany({
		where: {
			domainName: domainName,
			accepted: accepted !== undefined ? accepted : undefined,
		},
	});

	return success(res, {
		managers,
	});
};
