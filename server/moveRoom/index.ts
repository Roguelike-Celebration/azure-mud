import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { moveToRoom } from "../src/moveToRoom";
import authenticate from "../src/authenticate";

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

    await moveToRoom(user.id, toId, context);
  });
};

export default httpTrigger;
