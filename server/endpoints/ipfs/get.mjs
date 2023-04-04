import { success } from '../../utils/helpers.mjs';
import server from '../../server.mjs';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
  let cid = req.body.cid;
  let file;
  if (cid) {
    file = server.ipfs.get(cid);
    let stats = await server.ipfs.object.stat(link.path);
    link.size = stats.CumulativeSize;

    let extension = link.name.split('.').pop();

    if (!server?.config?.allowedExtensions?.includes(extension))
      throw new Error('File extension not allowed');

    if (link.size > 1024 * 1024 * 10) throw new Error('File too big');

    let resp = server.ipfs.cat(cid);
    let content = [];
    for await (const chunk of resp) {
      content = [...content, ...chunk];
    }
    file.content = content;
  }

  success(res, {
    cid,
    ...file,
  });
};
