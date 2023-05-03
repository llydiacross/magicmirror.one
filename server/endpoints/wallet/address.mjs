import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = (req, res) => {
	if (!req?.session?.siwe)
		return userError(res, 'You are not signed in with SIWE!');

	if (req?.sessionID !== server.redisClient.get(req.session?.siwe?.address)) {
		return userError(
			res,
			'Security Issue: SessionID is attached to different address'
		);
	}

	return success(res, {
		address: res.session.siwe.address,
	});
};
