import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { moveToRoom } from "../src/moveToRoom";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.headers && req.headers["x-ms-client-principal-name"];
  let toId = req.body && req.body.to;
  if (!userId || !toId) {
    context.res = {
      status: 500,
      body: "Include both a user ID and a room ID!",
    };
    return;
  }

  await moveToRoom(userId, toId, context);
};

export default httpTrigger;
