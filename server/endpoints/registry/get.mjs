import server from '../../server.mjs';
import { isLoggedIn, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let domainName = req.query.domainName;
	if (!domainName) return userError(res, 'No domain name provided');
	let fakeRegistry = await server.prisma.fakeRegistry.findUnique({
		where: {
			domainName,
		},
	});
	if (!fakeRegistry) return userError(res, 'User not found');
	return success(res, {
		fakeRegistry,
	});
};
