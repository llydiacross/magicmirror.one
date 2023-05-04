import pkg from 'siwe';
import jwt from 'jsonwebtoken';
import server from '../../server.mjs';
import { userError } from '../../utils/helpers.mjs';
const { SiweMessage, ErrorTypes } = pkg;

/**
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export const post = async (request, response) => {
	try {
		if (!request.body.message) return userError(response, 'Missing message.');

		const { message, signature } = request.body;
		const siweMessage = new SiweMessage(message);
		const fields = await siweMessage.validate(signature);

		if (fields.nonce !== request.session.nonce) {
			request.session.siwe = null;
			request.session.nonce = null;
			await new Promise((resolve) => request.session.save(resolve));
			return userError(response, 'Invalid nonce.');
		}

		request.session.siwe = fields;
		request.session.cookie.expires = new Date(fields.expirationTime);

		// We'll use this for actually authenticating the user to login.
		const jwtToken = jwt.sign({ message }, process.env.JWT_KEY, {
			expiresIn: '12h',
		});

		// Set the wallet's sessionID to redis.
		server.redisClient.set(fields.address, request.sessionID);
		request.session.save(() =>
			response
				.status(200)
				.cookie('jwt_token=authentication', jwtToken)
				.send(jwtToken)
				.end()
		);

		//add them to the database if they don't exist
		if (
			server.prisma.user.count({
				where: {
					address: fields.address,
				},
			}) === 0
		)
			server.prisma.user.create({
				data: {
					address: fields.address,
				},
			});
	} catch (err) {
		request.session.siwe = null;
		request.session.nonce = null;
		await new Promise((resolve) => request.session.save(resolve));
		// Log the error.
		console.error(err);
		// Very specifc error handling.
		switch (err) {
			case ErrorTypes.EXPIRED_MESSAGE:
				return userError(response, 'Expired message.');

			case ErrorTypes.INVALID_SIGNATURE:
				return userError(response, 'Invalid signature.');
			default:
				return userError(response, err.message);
		}
	}
};
