import { success } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
