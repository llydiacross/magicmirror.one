import server from '../../server.mjs';
import { userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let address = req.query.address;
	if (!address) return userError(res, 'No address provided');
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
	if (!user) return userError(res, 'User not found');
	return success(res, {
		user,
	});
};
