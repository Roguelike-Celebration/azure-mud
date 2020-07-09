import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getCache, roomKeyForUser } from "../src/redis";
import { hydrateUser } from "../src/hydrate";
import { moveToRoom } from "../src/moveToRoom";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.body && req.body.userId;
  let message = req.body && req.body.text;
  if (!userId || !message) {
    context.res = {
      status: 500,
      body: "Include a user ID and a message!",
    };
    return;
  }

  const user = await hydrateUser(userId);

  const commandMatch = /^\/(go|move) (.+)/.exec(message);
  if (commandMatch) {
    return await moveToRoom(userId, commandMatch[2], context);
  }

  context.res = {
    status: 200,
    body: {},
  };

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: "chatMessage",
      arguments: [userId, message],
    },
  ];
};

export default httpTrigger;
