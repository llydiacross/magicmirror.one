import server from '../../server.mjs'

/**
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
export const post = async (request, response) => {
  const { method } = request
  switch (method) {
    default: // If anything other than a POST, deny it.
      response.setHeader('Allow', ['POST'])
      response.status(405).end(`Method ${method} Not Allowed`)
      break
    case 'POST':
      try {
        request.session.destroy()
        server.redisClient.del(request.sessionID)
        console.log('Requested user has logged out.')
        response
          .status(200)
          .clearCookie('jwt_token=authentication')
          .send()
          .end()
      } catch (err) {
        response
          .status(500)
          .send("Internal server error. You're trapped.")
      }
  }
}
