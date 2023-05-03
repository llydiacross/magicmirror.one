import { generateNonce } from 'siwe';
import { userError } from '../../utils/helpers.mjs';
export const get = (request, response) => {
	if (request.session.siwe)
		return userError(
			res,
			'You are already logged in. Please log out to generate a new nonce to login with.'
		);

	request.session.nonce = generateNonce();
	response.setHeader('Content-Type', 'text/plain');
	response.status(200).send(request.session.nonce);
};
