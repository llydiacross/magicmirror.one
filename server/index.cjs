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
server.use(bodyParser.urlencoded({ extended: true }));

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


  let temp = parseFloat(request.body.temp) || 0.6;
  if (isNaN(temp))
    temp = 0.6;
  
  let n = parseInt(request.body.n) || 2;
  if (isNaN(n))
    n = 2;
  
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: request.body.prompt || 'Create a basic HTML website',
    temperature: temp,
    n: n,
    max_tokens: 1026,
  });

  response.send(completion.data);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
