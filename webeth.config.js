module.exports = {
  /**
   * @type {import('ipfs-core').Options}
   */
  ipfs: {},
  /**
   * If non set, will look for the environment variable OPENAI_KEY to use as the api key
   * @type {import('openai').Configuration}
   */
  openapi: {},
  /**
   * used to get files from IPFS, can be set to local host to use the node that is inside of the server already
   */
  ipfsEndpoint: 'https://dweb.link/api/v0',
  /**
   * CORS allowed origins, can be set to an empty array or removed to allow all origins
   */
  cors: [
    'https://localhost:3000',
    'https://localhost:9090',
    'http://localhost:3000',
    'http://localhost:9090',
    'https://webx.infinitymint.app',
    'https://infinitymint.app',
    'https://web.infinitymint.app',
    'https://web-api.infinitymint.app',
  ],
};
