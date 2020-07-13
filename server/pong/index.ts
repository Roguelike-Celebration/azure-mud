import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { setUserHeartbeat } from "../src/heartbeat";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let userId = req.body && req.body.userId;
  if (!userId) {
    context.res = {
      status: 500,
      body: "You did not include a user ID",
    };
  }

  await setUserHeartbeat(userId);

  context.res = {
    status: 200,
    body: {},
  };
};

export default httpTrigger;
