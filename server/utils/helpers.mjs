import glob from 'glob';

/**
 *
 * @returns
 */
export const getConfig = async () => {
  return await import('./../../webeth.config.js');
};

/**
 * 
 * @returns 
 */
export const getEndpointPath = async () => {
  let config = await getConfig();
  let endpointPath = config.endpointPath || './endpoints';
  if (endpointPath[endpointPath.length - 1] !== '/') endpointPath += '/';
  return endpointPath;
};

/**
 * Fetches all endpoints
 * @returns
 */
export const findEndpoints = async () => {
  let endpointPath = await getEndpointPath();
  //find endpoints
  return await new Promise(async (resolve, reject) => {
    glob(endpointPath + '**/*.mjs', (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
};
