export const get = async (request, response) => {
  const { method } = request
  switch (method) {
    case 'GET':
      if (!request.session.siwe) {
        response
          .status(401)
          .json({ message: 'You have to first sign_in' })
        return
      }
      console.log('User is authenticated!')
      response.setHeader('Content-Type', 'text/plain')
      response.send(
                `You are authenticated and your address is: ${request.session.siwe.address}`
      )
      break
    default:
      response.setHeader('Allow', ['GET'])
      response.status(405).end(`Method ${method} Not Allowed`)
  }
}
