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
    if (links.length > 64) break;

    if (link.type === 'file') {
      let stats = await server.ipfs.object.stat(link.path);
      link.size = stats.CumulativeSize;

      if (!link.name) continue;

      let extension = link.name.split('.').pop();

      if (!server?.config?.allowedExtensions?.includes(extension)) continue;

      if (link.size < 1024 * 1024 * 10) {
        let resp = server.ipfs.cat(link.path);
        let content = [];
        for await (const chunk of resp) {
          content = [...content, ...chunk];
        }
        link.content = content;
      }
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
