import { success, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	let { address } = req.body;

	if (!address) return userError(res, 'Missing address');

	let nfts = await server.prisma.eNS.findMany({
		where: {
			ownerAddress: address,
		},
	});

	return success(res, {
		nfts,
	});
};
