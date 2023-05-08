import { success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';
/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let { address, page } = req.query;
	page = parseInt(page) || 0;

	if (!address) return userError(res, 'Missing address');

	let enses = await server.prisma.eNS.findMany({
		where: {
			ownerAddress: address,
		},
		skip: page * server.config.magicMirror.pageMax,
		take: server.config.magicMirror.pageMax,
	});

	return success(res, {
		nfts: enses,
	});
};
