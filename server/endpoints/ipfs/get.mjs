import server from '../../server.mjs';


/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
  let cid = req.body.cid;
  let fileName = req.body.fileName;

  let result = [];
  for await (const file of server.ipfs.get(cid)) {
    console.log(file);

    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }

    result.push({
      ...{ ...file, content: null },
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
