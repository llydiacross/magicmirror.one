import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

export const settings = {
	requireLogin: false,
	requireTicket: false,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let { tokenId } = req.query;

	if (!tokenId) return userError(res, 'Missing tokenId');

	let ens = server.prisma.ens.findFirst({
		where: {
			tokenId: tokenId,
		},
	});

	if (!ens) return userError(res, 'No ENS found');

	return success(res, ens);
};
