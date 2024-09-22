import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, connection): Promise<void> {
  context.log('pondering orbs')
  if (req.headers.userid !== process.env.ORB_PONDER_USER) {
    context.res = {
      status: 401,
      body: 'Unauthorized'
    }
    return
  }

  context.log('valid orb ponderer')

  context.res = { body: connection }
}

export default httpTrigger
