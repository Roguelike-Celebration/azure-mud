import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import equipBadgeFunction from '../src/endpoints/orderNewDrink'

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    await authenticatedAzureWrap(context, req, orderNewDrink, { audit: true })
}

export default httpTrigger