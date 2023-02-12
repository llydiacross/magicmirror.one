import { Request, Response } from 'express';
import server from '../../server.mjs';

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export const post = async (req, res) => {
  let cid = req.body.cid;
  let fileName = req.body.fileName;
  let returnDirectory = req.body.returnDirectory || false;
  if (returnDirectory === 'true') returnDirectory = true;
  else returnDirectory = false;

  let result = [];
  for await (const file of server.ipfs.get(cid)) {
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }

    result.push({
      path: file.path,
      content: content.toString(),
    });
  }

  let obj = {
    cid,
    files: result,
  };

  if (fileName) {
    obj.fileName = fileName;
    obj.content = result[0].content;
  }
  success(res, obj);
};
