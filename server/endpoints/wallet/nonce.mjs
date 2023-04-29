import { generateNonce } from 'siwe'
export const get = (request, response) => {
  request.session.nonce = generateNonce()
  response.setHeader('Content-Type', 'text/plain')
  response.status(200).send(request.session.nonce)
}
