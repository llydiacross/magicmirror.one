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

    if (link.type === 'file') {
      let resp = server.ipfs.cat(link.path);
      let content = [];
      for await (const chunk of resp) {
        content = [...content, ...chunk];
      }
      link.content = content;
      links.push(link);
      continue;
    }

    //is dir
    links.push(link);
  }
  success(res, {
    cid,
    files: links,
  });
};
