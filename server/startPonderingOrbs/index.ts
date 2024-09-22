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

  context.log('got a real pondererr')
  // This never gets undone, but the fact this group always exists is ~fine~
  context.bindings.actions = [{
    actionName: 'addUserToGroup',
    userId: req.headers.userid,
    group: 'orbMessages'
  }]

  context.log('Set up action to add user to group')
  context.log('connection', connection)

  context.res = { body: connection }
}

export default httpTrigger
