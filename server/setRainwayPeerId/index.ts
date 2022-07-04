import { AzureFunction, Context } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import setRainwayPeerId from '../src/endpoints/setRainwayPeerId'

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  await azureWrap(context, undefined, setRainwayPeerId)
}

export default timerTrigger
