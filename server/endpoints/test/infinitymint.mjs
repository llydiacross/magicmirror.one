import server from '../../server.mjs';


/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const get = async (req, res) => {

    res.json({
        test: server.infinityConsole.getSessionId()
    })
}