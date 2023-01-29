const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {Configuration, OpenAIApi} = require('openai');
const bodyParser = require('body-parser')

const server = express();
const port = 9090;

// Configure OpenAI
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

server.use(bodyParser.json());

server.use(cors({
  origin: 'http://localhost:3000',
}));

server.use(helmet({
  crossOriginResourcePolicy: false,
}));

server.get('/', (_request, response) => {
  response.send('Hello World!')
});

server.post('/gpt/prompt', async (request, response) => {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: request.body.prompt,
    temperature: 0,
    max_tokens: 7,
  });

  console.log(request.body);

  response.send(completion.data);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
