const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const server = express();
const port = 9090;
require("dotenv").config();

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

server.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
server.use(
  cors({
    origin: [
      "https://localhost:3000",
      "https://webx.infinitymint.app",
      "https://infinitymint.app",
      "https://web.infinitymint.app",
    ],
  })
);
//the json body parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

//for dev
server.use(morgan("dev"));


// An error handling middleware
server.use((err, _request, response, _next) => {
  response.status(500).send("Oops, something went wrong.\n", err);
});

server.get("/", (_request, response) => {
  response.status(200).json({ ok: true });
});

server.post("/gpt/prompt", async (request, response) => {
  let temperature = parseFloat(request.body.temp) || 0.6;
  if (isNaN(temperature)) temperature = 0.6;

  if (temperature > 3) temperature = 3;

  let n = parseInt(request.body.n) || 2;
  if (isNaN(n)) n = 2;

  if (n > 6) n = 6;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: request.body.prompt || "Create a basic HTML website",
      temperature,
      n,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    response.status(200).send(completion.data);
  } catch (error) {
    throw new Error("Something went horribly wrong!", error.status);
  }
});

server.listen(port, () => {
  console.log(`web3.eth listening on port ${port}`);
});
