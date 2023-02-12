import { Request, Response } from 'express';
import server from '../../server.mjs';

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const post = async (req, res) => {
    let name = req.body.name;
    let result = await server.ipfs.name.resolve(name);
    res.send({
        cid: result.path,
    });
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => {};

/**
 * Uncomment to specify path
 */
//export const path = '/<folder/dirs>/<this_file_name>';
