import server from '../../server.mjs';
import { exclude, success } from '../../utils/helpers.mjs';

export const settings = {
	requireLogin: false,
	requireTicket: false,
	admin: false,
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {
	let parameter = req.query.parameter;
	parameter = parameter || 'totalViews';

	if (
		parameter !== 'totalViews' &&
		parameter !== 'lastHourlyViews' &&
		parameter !== 'lastDailyViews' &&
		parameter !== 'lastWeeklyViews' &&
		parameter !== 'lastMonthlyViews' &&
		parameter !== 'lastYearlyViews'
	)
		return userError(res, 'Invalid parameter');

	//return top 100 domains by total views
	let top = await server.prisma.stats.findMany({
		orderBy: { [parameter]: 'desc' },
		take: 100,
	});
	top = top.filter((x) => x.totalViews > 0);
	top = top.map((x) => {
		return exclude(x, ['ENS']);
	});
	return success(res, top);
};
