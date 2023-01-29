const express = require('express');
const cors = require('cors');

const server = express();
const port = 9090;

server.use(cors({
  origin: 'http://localhost:3000',
}));

server.get('/', (_request, response) => {
  response.send('Hello World!')
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
