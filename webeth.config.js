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

  allowedExtensions: [
    'xens',
    'html',
    'js',
    'css',
    'json',
    'htm',
    'svg',
    'partial'
  ],
  /**
   *
   */
  web3Storage:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZjZWYwNjFCYTkxNGZhYTdFNjU3NEI2N0E0NjU4YjIyNzgwMTYxQmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA0MTM0MTMzMjgsIm5hbWUiOiJpbmZpbml0eS1taW50In0.se1kP3g-ssSs0G8DjIrd2pbUeq1b_OzuCqFoxzepZVA',
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
    'https://web-api.infinitymint.app'
  ]
}
