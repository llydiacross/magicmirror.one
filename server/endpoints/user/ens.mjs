import server from '../../server.mjs';
import { isLoggedIn, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	if (!isLoggedIn(req, res)) return userError(res, isLoggedIn(req, res));
	let address = req.query.address || req.session.siwe.address;

	if (!address) return userError(res, 'No address provided');

	let user = await server.prisma.user.findUnique({
		where: {
			address,
		},
		select: {
			ENS: true,
		},
	});

	return success(res, {
		user,
	});
};
