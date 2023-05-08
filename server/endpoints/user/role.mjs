//import server from '../../server.mjs';

import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

export const settings = {
	requireLogin: false,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	let address = req.body.address;
	let group = req.body.group;

	if (!address) return userError(res, 'No address provided');

	let user = await server.prisma.user.findUnique({
		where: {
			address,
		},
	});

	if (!user) return userError(res, 'User not found');

	if (user.role === 'ADMIN')
		return userError(
			res,
			'Admins cannot be modified by this endpoint, must be done manually'
		);

	await server.prisma.user.update({
		where: {
			address,
		},
		data: {
			role: group.toUpperCase(),
		},
	});

	return success(res);
};
