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

  let roomId = await getCache(roomKeyForUser(userId));
  if (!roomId) {
    roomId = "kitchen";
    await setCache(roomKeyForUser(userId), roomId);
  }

  const room = roomData[roomId];

  const roomOccupants = await addUserToRoomPresence(userId, roomId);

  context.res = {
    status: 200,
    body: {
      room,
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
      groupName: roomId,
      action: "add",
    },
  ];

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      groupName: roomId,
      target: "playerConnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
