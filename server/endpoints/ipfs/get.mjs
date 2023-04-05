import { success } from '../../utils/helpers.mjs'
import server from '../../server.mjs'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
  const cid = req.body.cid
  let file
  if (cid) {
    file = server.ipfs.get(cid)
    const stats = await server.ipfs.object.stat(link.path)
    link.size = stats.CumulativeSize

    const extension = link.name.split('.').pop()

    if (!server?.config?.allowedExtensions?.includes(extension)) { throw new Error('File extension not allowed') }

    if (link.size > 1024 * 1024 * 10) throw new Error('File too big')

    const resp = server.ipfs.cat(cid)
    let content = []
    for await (const chunk of resp) {
      content = [...content, ...chunk]
    }
    file.content = content
  }

  success(res, {
    cid,
    ...file
  })
}
