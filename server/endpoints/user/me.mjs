import server from '../../server.mjs';
import { isLoggedIn, success, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	if ((await isLoggedIn(req, server)) !== true)
		return userError(res, await isLoggedIn(req, server));

	let address = req.session.siwe.address;
	let user = await server.prisma.user.findUnique({
		where: {
			address,
		},
		select: {
			address: true,
			createdAt: true,
			role: true,
		},
	});

	return success(res, {
		user,
	});
};
