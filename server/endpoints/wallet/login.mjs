import pkg from 'siwe';
import jwt from 'jsonwebtoken';
import server from '../../server.mjs';
const { SiweMessage, ErrorTypes } = pkg;

/**
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export const post = async (request, response) => {
	const { method } = request;
	switch (method) {
		default: // If anything other than a POST, deny it.
			response.setHeader('Allow', ['POST']);
			response.status(405).end(`Method ${method} Not Allowed`);
			break;
		case 'POST':
			try {
				if (!request.body.message) {
					response.status(422).json({
						ok: false,
						error: 'Expected prepareMessage object as body.',
					});
					return;
				}

				const { message, signature } = request.body;
				const siweMessage = new SiweMessage(message);
				const fields = await siweMessage.validate(signature);

				if (fields.nonce !== request.session.nonce) {
					response.status(422).json({
						ok: false,
						error: 'Invalid nonce.',
					});
					return;
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
				console.error(err);

				// Very specifc error handling.
				const { message } = err;
				switch (err) {
					case ErrorTypes.EXPIRED_MESSAGE: {
						request.session.save(() =>
							response.status(440).ok(false).json({ message })
						);
						break;
					}
					case ErrorTypes.INVALID_SIGNATURE: {
						request.session.save(() =>
							response.status(422).ok(false).json({ message })
						);
						break;
					}
					default: {
						request.session.save(() =>
							response.status(500).ok(false).json({ message })
						);
						break;
					}
				}
			}
			break;
	}
};
