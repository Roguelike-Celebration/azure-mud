import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { RoomResponse } from "../src/types";
import {
  getCache,
  setCache,
  roomPresenceKey,
  roomKeyForUser,
  addUserToRoomPresence,
} from "../src/redis";
import { roomData } from "../src/room";
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

  const roomOccupants = await addUserToRoomPresence(userId, user.roomId);

  context.res = {
    status: 200,
    body: {
      room: user.room,
      roomOccupants,
    } as RoomResponse,
  };

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: "users",
      action: "add",
    },
    {
      userId,
      groupName: user.roomId,
      action: "add",
    },
  ];

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: "playerConnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
