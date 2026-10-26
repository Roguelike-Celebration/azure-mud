import { input, output } from '@azure/functions'

/* Azure Functions bindings for Functions v4 programming model.
 * (In the old v3 model, these were in a bunch of per-function subdirs as
 * '<fcn>/function.json' files, but in v4 we can do it centrally and programmatically
 * at registration time with app.http().)
 */

export const webPubSubOutput = output.webPubSub({
  name: 'actions',
  hub: 'chat'
})

export const auditLogOutput = output.table({
  tableName: 'auditLog',
  connection: 'AzureWebJobsStorage'
})

export const webPubSubConnectionInput = input.webPubSubConnection({
  name: 'connection',
  hub: 'chat',
  userId: '{headers.userid}'
})

// Legacy SignalR connection info, from before the move to Web PubSub; only `negotiate` uses it.
export const signalRConnectionInput = input.generic({
  type: 'signalRConnectionInfo',
  name: 'connectionInfo',
  hubName: 'chat',
  userId: '{headers.userid}',
  connectionStringSetting: 'AzureSignalRConnectionString'
})
