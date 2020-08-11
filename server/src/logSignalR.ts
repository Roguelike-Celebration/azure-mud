import { Context } from '@azure/functions'

export default function logSignalR(context: Context) {
  context.log('HTTP response', context.res)
  context.log('Group actions', context.bindings.signalRGroupActions)
  context.log('Messages', context.bindings.signalRMessages)
}
