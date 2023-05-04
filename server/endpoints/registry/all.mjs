import server from '../../server.mjs';
import { isLoggedIn, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let ownerAddress = req.query.address;
	let fakeRegistry = await server.prisma.fakeRegistry.findMany({
		where: {
			ownerAddress,
		},
	});
	if (!fakeRegistry) return userError(res, 'User not found');
	return success(res, {
		fakeRegistry,
	});
};
