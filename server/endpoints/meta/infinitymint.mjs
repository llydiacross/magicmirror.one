import server from '../../server.mjs';
import { success } from '../../utils/helpers.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	return success(res, {
		infinityMint: server.infinityConsole.getSessionId(),
	});
};
