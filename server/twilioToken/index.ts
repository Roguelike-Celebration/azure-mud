import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getUserIdFromHeaders } from '../src/authenticate'
const { jwt: { AccessToken } } = require('twilio')

const VideoGrant = AccessToken.VideoGrant
const MAX_ALLOWED_SESSION_DURATION = 14400

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const userId = await getUserIdFromHeaders(context, req)

  if (!userId) {
    context.res = {
      status: 401,
      body: 'The user name is required to ensure their access token'
    }
  }

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION }
  )

  // Assign the generated identity to the token.
  token.identity = userId

  // Grant the access token Twilio Video capabilities.
  const grant = new VideoGrant()
  token.addGrant(grant)

  // Serialize the token to a JWT string.
  context.res = {
    body: token.toJwt()
  }
}

export default httpTrigger
