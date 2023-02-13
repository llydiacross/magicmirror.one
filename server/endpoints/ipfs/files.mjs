import { success } from 'daisyui/src/colors';
import { Request, Response } from 'express';
import server from '../../server.mjs';
/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const post = async (req, res) => {
  let cid = req.body.cid;
  let links = [];
  for await (const link of server.ipfs.ls(cid)) {
    links.push(link);
  }
  success(res, {
    cid,
    files: links,
  });
};
