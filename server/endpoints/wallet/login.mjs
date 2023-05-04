import pkg from 'siwe';
import jwt from 'jsonwebtoken';
import server from '../../server.mjs';
import { userError } from '../../utils/helpers.mjs';
const { SiweMessage, ErrorTypes } = pkg;

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
	try {
		if (!req.body.message) return userError(res, 'Missing message.');

		let SIWEObject = new SiweMessage(req.body.message);
		const { data: message } = await SIWEObject.verify({
			signature: req.body.signature,
			nonce: req.session.nonce,
		});
		req.session.siwe = message;
		req.session.cookie.expires = new Date(message.expirationTime);
		await new Promise((resolve) => req.session.save(resolve));

		//add them to the database if they don't exist
		if (
			server.prisma.user.count({
				where: {
					address: message.address,
				},
			}) === 0
		)
			server.prisma.user.create({
				data: {
					address: message.address,
				},
			});
	} catch (err) {
		req.session.siwe = null;
		req.session.nonce = null;
		await new Promise((resolve) => req.session.save(resolve));
		// Log the error.
		console.error(err);
		// Very specifc error handling.
		switch (err) {
			case ErrorTypes.EXPIRED_MESSAGE:
				return userError(res, 'Expired message.');

			case ErrorTypes.INVALID_SIGNATURE:
				return userError(res, 'Invalid signature.');
			default:
				return userError(res, err.message);
		}
	}
};
