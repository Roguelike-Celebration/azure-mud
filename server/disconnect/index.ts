import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  roomPresenceKey,
  getCache,
  setCache,
  removeUserFromRoomPresence,
  roomKeyForUser,
} from "../src/redis";

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

  const roomId = await getCache(roomKeyForUser(userId));

  context.res = {
    status: 200,
  };

  await removeUserFromRoomPresence(userId, roomId);

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: "users",
      action: "remove",
    },
    {
      userId,
      groupName: roomId,
      action: "remove",
    },
  ];

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      groupName: roomId,
      target: "playerDisconnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
