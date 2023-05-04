/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	let { address } = req.body;

	if (!address) return userError(res, 'Missing address');

	let count = await server.prisma.eNS.count({
		where: {
			ownerAddress: address,
		},
	});

	return success(res, {
		count,
		pages: Math.ceil(count / 100),
	});
};
