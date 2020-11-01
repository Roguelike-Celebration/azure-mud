import { AzureFunction, Context } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import heartbeat from '../src/endpoints/heartbeat'

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  await azureWrap(context, undefined, heartbeat)
}

export default timerTrigger
