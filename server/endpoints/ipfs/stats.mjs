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
    if (links.length > 32) break;

    if (link.type === 'file') {
      let stats = await server.ipfs.object.stat(link.path);
      link.size = stats.CumulativeSize;
    }

    //is dir
    links.push(link);
  }
  let musicExtensions = ['mp3', 'wav', 'ogg', 'flac'];
  let videoExtensions = ['mp4', 'webm', 'mov'];
  let imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
  let hasXENS =
    links.filter((link) => link.name && link.name.split('.').pop() === 'xens')
      .length > 0;
  let hasIndex = links.filter((link) => link?.name === 'index.html').length > 0;
  let hasReadme = links.filter((link) => link?.name === 'README.md').length > 0;
  let hasLicense =
    links.filter((link) => link?.name === 'LICENSE.md').length > 0;
  let hasPackage =
    links.filter((link) => link?.name === 'package.json').length > 0;
  let hasManifest =
    links.filter((link) => link?.name === 'manifest.json').length > 0;
  let hasSettings =
    links.filter((link) => link?.name === 'settings.json').length > 0;
  let hasCSS = links.filter((link) => link?.name === 'style.css').length > 0;
  let hasJS = links.filter((link) => link?.name === 'script.js').length > 0;
  let hasMusic =
    links.filter((link) => {
      return link.name && musicExtensions.includes(link.name.split('.').pop());
    }).length > 0;
  let hasImages =
    links.filter((link) => {
      return link.name && imageExtensions.includes(link.name.split('.').pop());
    }).length > 0;
  let hasVideos =
    links.filter((link) => {
      return link.name && videoExtensions.includes(link.name.split('.').pop());
    }).length > 0;
  let videoCount = links.filter((link) => {
    return link.name && videoExtensions.includes(link.name.split('.').pop());
  }).length;
  let imageCount = links.filter((link) => {
    return link.name && imageExtensions.includes(link.name.split('.').pop());
  }).length;
  let musicCount = links.filter((link) => {
    return link.name && musicExtensions.includes(link.name.split('.').pop());
  }).length;
  let fileCount = links.filter((link) => link.type === 'file').length;
  let dirCount = links.filter((link) => link.type === 'dir').length;
  let hasPartialIndex =
    links.filter((link) => link?.name === 'index.partial').length > 0;
  let hasPartialCSS =
    links.filter((link) => link?.name === 'css.partial').length > 0;
  let hasPartialJS =
    links.filter((link) => link?.name === 'js.partial').length > 0;

  success(res, {
    cid,
    files: links,
    dirs: links.filter((link) => link.type === 'dir'),
    dirCount,
    hasXENS,
    hasIndex,
    hasReadme,
    hasLicense,
    hasPackage,
    hasPartialIndex,
    hasPartialCSS,
    hasPartialJS,
    hasManifest,
    hasSettings,
    hasMusic,
    hasCSS,
    hasJS,
    hasImages,
    hasVideos,
    videoCount,
    imageCount,
    musicCount,
    fileCount,
  });
};
