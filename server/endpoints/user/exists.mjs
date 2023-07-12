import server from '../../server.mjs'
import { userError } from '../../utils/helpers.mjs'
import { ethers } from 'ethers'

export const settings = {
	requireLogin: false,
	admin: false
}

export const get = async (req, res) => {
	await post(req, res)
}

export const post = async (req, res) => {
	let {address} = req.query

	if (!address || address === null || address === undefined) {
		return userError(res, 'No address provided in field!')
	}

	if (!ethers.utils.isAddress(address)) {
		return userError(res, 'Invalid address');
	}

	let validUser = await server.prisma.user.findUnique(
		{where: {address}}
	)

	if (!validUser) {
		return false
	}

	return true
}
