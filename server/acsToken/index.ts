import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CommunicationIdentityClient } from '@azure/communication-administration'

const identityClient = new CommunicationIdentityClient(
  process.env.COMMUNICATION_SERVICES_CONNECTION_STRING
)

type ClientPrincipal = {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
};

type TokenResponse = {
  token: string;
  expiresOn: Date;
  communicationUserId: string;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const header = req.headers['x-ms-client-principal']
  const encoded = Buffer.from(header, 'base64')
  const decoded = encoded.toString('ascii')

  const userId = req.headers && req.headers['x-ms-client-principal-id']

  if (!userId) {
    context.res = {
      status: 401,
      body: 'The user name is required to ensure their access token'
    }
    return
  }

  const user = await identityClient.createUser()
  const tokenResponse = await identityClient.issueToken(user, ['voip'])

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      token: tokenResponse.token,
      expiresOn: tokenResponse.expiresOn,
      communicationUserId: user.communicationUserId
    } as TokenResponse
  }
}

export default httpTrigger
