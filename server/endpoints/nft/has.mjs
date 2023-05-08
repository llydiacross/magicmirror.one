import server from '../../server.mjs';
import { ethers } from 'ethers';

export const settings = {
	requireLogin: true,
	requireTicket: false,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let address = req.session.siwe.address;

	if (!address) return userError(res, 'Missing address');
	if (!ethers.utils.isAddress(address))
		return userError(res, 'Invalid address');

	//first we get the deployment class for the erc721 contract
	let deploymentClass = (
		await server.infinityConsole.getProjectDeploymentClasses('magicmirror')
	).erc721;

	//then we get a signer contract instance from ethers
	/**
	 * @type import('infinitymint/dist/typechain-types/InfinityMint.js').InfinityMint
	 */
	let erc721 = await deploymentClass.getSignedContract();
	//then we call balance of
	let balance = await erc721.balanceOf(address);

	return success(res, {
		has: balance > 0,
		count: balance,
	});
};
