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
 * @param {import('express').Response} res 
 * @param {object} data
 * @returns 
 */
export const success = (res, data) => { 
    res.status(200).json(data);
}

/**
 * 
 * @param {import('express').Response} res 
 * @param {string} message 
 * @returns 
 */
export const userError = (res, message) => {
    res.status(400).json({
        ok: false,
        error: message
    });
    return false;
}


/**
 * 
 * @returns 
 */
export const getEndpointPath = async () => {
  let config = await getConfig();
  let endpointPath = config.endpointPath || 'server/endpoints';
    if (endpointPath[endpointPath.length - 1] !== '/') endpointPath += '/';
  return process.cwd() + '/' + endpointPath;
};

/**
 * Fetches all endpoints
 * @returns
 */
export const findEndpoints = async () => {
  let endpointPath = await getEndpointPath();
  //find endpoints
    
    console.log(endpointPath + '**/*.mjs', 'glob')
    
  return await new Promise(async (resolve, reject) => {
    glob(endpointPath + '**/*.mjs', (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
};
