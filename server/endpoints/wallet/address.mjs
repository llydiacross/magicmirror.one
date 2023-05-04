import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = (req, res) => {
	if (!isLoggedIn(req, res)) return userError(res, isLoggedIn(req, res));
	return success(res, {
		address: res.session.siwe.address,
	});
};
