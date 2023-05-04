import { success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

export const get = async (req, res) => {
	if (!req.query.address)
		return res.status(400).send({
			error: 'Missing address',
		});

	req.body.address = req.query.address;
	await post(req, res);
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	let address = req.body.address;

	if (!req.session.siewe)
		return res.status(400).send({
			error: 'Missing session',
		});

	if (!address)
		return res.status(400).send({
			error: 'Missing address',
		});

	try {
		let nfts = await server.alchemy.nft.getNftsForOwner(address, {
			contractAddresses: ['0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'],
		});

		for (let i = 0; i < nfts.length; i++) {
			let nft = nfts.ownedNfts[i];

			await server.prisma.ENS.create({
				data: {
					name: 'Alice',
					email: 'alice@prisma.io',
				},
			});
		}
	} catch (error) {
		console.log(error);
		return userError(res, 'Bad Address');
	}
};
