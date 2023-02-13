import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
    let name = req.body.name;
    let result = await server.ipfs.name.resolve(name);
    res.send({
        cid: result.path,
    });
};