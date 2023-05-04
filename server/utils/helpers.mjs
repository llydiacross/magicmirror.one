import glob from 'glob';

/**
 *
 * @param {import('express').Response} res
 * @param {object} data
 * @returns
 */
export const success = (res, data) => {
	res.status(200).json(data);
};

/**
 *
 * @param {import('express').Response} res
 * @param {string | object} message
 * @returns
 */
export const userError = (res, message) => {
	if (message?.error !== undefined) message = message.error;
	res.status(400).json({
		ok: false,
		error: message,
	});
	return false;
};

/**
 * @param {import('infinitymint/dist/app/interfaces').InfinityMintConfig} config
 * @returns
 */
export const getEndpointPath = (config) => {
	let endpointPath = config.endpointPath || 'server/endpoints';
	if (endpointPath[endpointPath.length - 1] !== '/') endpointPath += '/';
	return process.cwd() + '/' + endpointPath;
};

/**
 * Fetches all endpoints
 * @returns
 */
export const findEndpoints = async (endpointPath) => {
	// find endpoints

	console.log(endpointPath + '**/*.mjs', 'glob');

	return await new Promise(async (resolve, reject) => {
		glob(endpointPath + '**/*.mjs', (err, files) => {
			if (err) {
				reject(err);
			}
			resolve(files);
		});
	});
};
