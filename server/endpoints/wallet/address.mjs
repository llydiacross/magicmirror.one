import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	if ((await isLoggedIn(req, res)) !== true)
		return userError(res, await isLoggedIn(req, res));

	return success(res, {
		address: res.session.siwe.address,
	});
};
