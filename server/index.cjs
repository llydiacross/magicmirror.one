const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Configuration, OpenAIApi } = require('openai');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const glue = require('jsglue');
const server = express();
const port = 9090;

//dot env stuff
require('dotenv').config();

/**
 * @type {import('ipfs-core').IPFS}
 */
let node;
(async () => {
  let wrapper = await glue.load();

  /**
   * @type {import('ipfs-core')}
   */
  let ipfs = wrapper.getSync('ipfs-core');
  node = await ipfs.create();
  console.log('\n✅ IPFS node ready');
})();

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

//helmet
server.use(helmet());

server.use(
  cors({
    origin: [
      'https://localhost:3000',
      'https://localhost:9090',
      'http://localhost:3000',
      'http://localhost:9090',
      'https://webx.infinitymint.app',
      'https://infinitymint.app',
      'https://web.infinitymint.app',
      'https://web-api.infinitymint.app',
    ],
  })
);
//function like an API
server.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//the json body parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

//for dev
server.use(morgan('dev'));

// An error handling middleware
server.use((err, _request, response, _next) => {
  response.status(500).send({
    status: 500,
    message: err.message,
  });
  _next();
});

//the index
server.get('/', (_request, response) => {
  response.status(200).json({ ok: true });
});

server.post('/ipfs/get', async (request, response) => {
  let cid = request.body.cid;
  let fileName = request.body.fileName;

  if (!fileName) throw new Error('No file name provided');

  if (!cid) throw new Error('No CID provided');

  for (const file of node.get(cid)) {
    if (file.type === 'file' && file.name === fileName) {
      const content = [];
      for await (const chunk of file.content) {
        content.push(chunk);
      }
      response.status(200).send({
        cid: cid,
        data: content,
      });
      return;
    }
  }

  response.status(500).send({
    cid: cid,
    message: 'File not found',
    status: 500,
  });
});

server.post('/ipns/resolve', async (request, response) => {
  let ipnsCid = request.body.path;

  if (!ipnsCid) throw new Error('No IPNS CID provided');

  try {
    let ipfsCid;
    for await (const name of node.name.resolve(ipnsCid)) {
      ipfsCid = name;
    }

    response.status(200).send({
      cid: ipfsCid,
    });
  } catch (error) {
    console.error(error)
    throw new Error('bad IPNS CID provided');
  }
});

server.post('/gpt/prompt', async (request, response) => {
  let temperature = parseFloat(request.body.temp) || 0.6;
  if (isNaN(temperature)) temperature = 0.6;

  if (temperature > 3) temperature = 3;

  let n = parseInt(request.body.n) || 2;
  if (isNaN(n)) n = 2;

  if (n > 6) n = 6;

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: request.body.prompt || 'Create a basic HTML website',
    temperature,
    n,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  response.status(200).send(completion.data);
});

server.listen(port, () => {
  console.log(`web3.eth listening on port ${port}`);
});
