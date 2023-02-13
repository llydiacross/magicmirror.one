import { OpenAIApi, Configuration } from 'openai';
import server from '../../server.mjs';
import { success, userError } from '../../utils/helpers.mjs';

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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const post = async (req, res) => {
  let temperature = parseFloat(req.body.temp) || 0.6;
  if (isNaN(temperature)) temperature = 0.6;

  if (temperature > 3) temperature = 3;
  if (req.body.prompt === undefined)
    return userError(res, 'No prompt provided');

  let n = parseInt(req.body.n) || 2;
  if (isNaN(n)) n = 2;

  if (n > 6) n = 6;

  try {
    let completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: req.body.prompt,
      temperature,
      n,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    success(res, completion.data);
  } catch (error) {
    console.log('OpenAI Error', error)
    return userError(res, 'Sorry, OpenAI is not responding right now. Please try again later.');
  }
};

/**
 * Uncomment to specify path
 */
//export const path = '/<folder/dirs>/<this_file_name>';
