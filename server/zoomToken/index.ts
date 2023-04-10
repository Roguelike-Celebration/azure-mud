// Adapted from https://github.com/zoom/meetingsdk-sample-signature-node.js

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedAzureWrap } from "../src/azureWrap";
import zoomToken from "../src/endpoints/zoomToken";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, zoomToken);
};

export default httpTrigger;
