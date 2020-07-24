import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { moveToRoom } from "../src/moveToRoom";
import authenticate from "../src/authenticate";
import logSignalR from "../src/logSignalR";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, async (user) => {
    let toId = req.body && req.body.to;
    if (!toId) {
      context.res = {
        status: 500,
        body: "Include a room ID!",
      };
      return;
    }

    await moveToRoom(user, toId, context);
  });
  logSignalR(context);
};

export default httpTrigger;
