const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();
const port = 9090;

server.use(cors({
  origin: 'http://localhost:3000',
}));

server.use(helmet({
  crossOriginResourcePolicy: false,
}));

server.get('/', (_request, response) => {
  response.send('Hello World!')
});

server.get('/api/ai/generate', (_request, repsonse) => {})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
