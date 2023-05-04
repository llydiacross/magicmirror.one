import server from '../../server.mjs';
import { isLoggedIn, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let domainName = req.query.domainName;
	let fakeRegistry = await server.prisma.fakeRegistry.findUnique({
		where: {
			domainName,
		},
	});
	if (!fakeRegistry)
		return success(res, {
			has: false,
		});

	if (!fakeRegistry.registry || !fakeRegistry.registry.length)
		return success(res, {
			has: false,
		});

	return success(res, {
		has: true,
	});
};
