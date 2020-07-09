import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  roomPresenceKey,
  getCache,
  setCache,
  removeUserFromRoomPresence,
  roomKeyForUser,
} from "../src/redis";
import { hydrateUser } from "../src/hydrate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.body && req.body.userId;
  if (!userId) {
    context.res = {
      status: 500,
      body: "You did not include a user ID",
    };
  }

  const user = await hydrateUser(userId);

  context.res = {
    status: 200,
  };

  await removeUserFromRoomPresence(userId, user.roomId);

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: "users",
      action: "remove",
    },
    {
      userId,
      groupName: user.roomId,
      action: "remove",
    },
  ];

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: "playerDisconnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
