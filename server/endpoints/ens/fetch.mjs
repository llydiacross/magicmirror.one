import { success, userError } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

export const get = async (req, res) => {
	await post(req, res);
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	if ((await isLoggedIn(req, server)) !== true)
		return userError(res, await isLoggedIn(req, server));

	let lastFetched = await server.prisma.lastFetched.findFirst({
		where: {
			address: address,
		},
	});

	if (
		lastFetched &&
		lastFetched.lastFetched > (lastFetched.isPowerUser ? 10 : 1) * 60 * 1000
	)
		return userError(res, 'You have to wait a bit before fetching again');

	try {
		let totalCount = 0;
		let fetchNFTS = async (address, pageKey) => {
			let nfts = await server.alchemy.nft.getNftsForOwner(address, {
				contractAddresses: [
					'0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
				],
				pageKey: pageKey,
			});

			for (let i = 0; i < nfts.ownedNfts.length; i++) {
				let nft = nfts.ownedNfts[i];

				totalCount++;

				await server.prisma.eNS.create({
					data: {
						tokenId: nft.tokenId,
						ownerAddress: address,
						ensContractAddress: nft.contract.address,
						domainName: nft.title,
						nftUri: nft.tokenUri,
						nftName: nft.title,
						nftDescription: nft.description,
						nftMedia: nft.media,
					},
				});
			}

			if (nfts.pageKey) await fetchNFTS(address, nfts.pageKey);
		};

		await fetchNFTS(address);

		await server.prisma.lastFetched.upsert({
			where: {
				address: address,
			},
			update: {
				lastFetched: new Date(),
				isPowerUser: totalCount > 100,
			},
			create: {
				address: address,
				lastFetched: new Date(),
				isPowerUser: totalCount > 100,
			},
		});

		return success(res, {
			success: true,
			totalCount: totalCount,
		});
	} catch (error) {
		console.log(error);
		return userError(res, 'Bad Address');
	}
};
