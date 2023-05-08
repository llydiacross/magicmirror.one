import server from '../../server.mjs';

export const settings = {
	requireLogin: true,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let domainName = req.query.domainName;
	if (!domainName) return userError(res, 'No domain name provided');
	let page = res.query.page || 0;
	page = parseInt(page) || 0;
	//search for the address in the database
	let enses = await server.prisma.eNS.findMany({
		where: {
			domainName: {
				contains: domainName,
			},
		},
		skip: page * server.config.magicMirror.pageMax,
		take: server.config.magicMirror.pageMax,
	});

	if (enses)
		enses = enses.map((ens) => {
			return exclude(ens, ['FakeRegistry', 'Manager', 'User']);
		});

	return success(res, {
		enses,
	});
};
