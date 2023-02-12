import { OpenAIApi, Configuration } from 'openai';
import server from '../../server.mjs';
import { Request, Response } from 'express';

// Configure OpenAI
const configuration = new Configuration(
  server.config.openapi && server.config.openapi.apiKey
    ? server.config.openapi
    : {
        apiKey: process.env.OPENAI_KEY,
      }
);

const openai = new OpenAIApi(configuration);

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const post = async (req, res) => {
  let temperature = parseFloat(req.body.temp) || 0.6;
  if (isNaN(temperature)) temperature = 0.6;

  if (temperature > 3) temperature = 3;

  let n = parseInt(req.body.n) || 2;
  if (isNaN(n)) n = 2;

  if (n > 6) n = 6;

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: req.body.prompt || 'Create a basic HTML website',
    temperature,
    n,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  response.status(200).send(completion.data);
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export const get = async (req, res) => { };

/**
 * Uncomment to specify path
 */
//export const path = '/<folder/dirs>/<this_file_name>';
