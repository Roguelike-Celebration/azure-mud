import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { roomData } from "../src/room";
import {
  getCache,
  roomKeyForUser,
  setCache,
  addUserToRoomPresence,
  removeUserFromRoomPresence,
} from "../src/redis";
import { RoomResponse } from "../src/types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.body && req.body.userId;
  let toId = req.body && req.body.to;
  if (!userId || !toId) {
    context.res = {
      status: 500,
      body: "Include both a user ID and a room ID!",
    };
    return;
  }

  const to = roomData[toId];
  if (!to) {
    context.res = {
      status: 500,
      body: "Invalid room ID",
    };
    return;
  }

  const fromId = await getCache(roomKeyForUser(userId));
  const from = roomData[fromId];
  if (!from) {
    context.res = {
      status: 500,
      body: "Player in an invalid state",
    };
    return;
  }

  await removeUserFromRoomPresence(userId, fromId);

  context.res = {
    status: 200,
    body: {
      room: to,
      roomOccupants: await addUserToRoomPresence(userId, toId),
    } as RoomResponse,
  };

  context.bindings.signalRMessages = [
    {
      groupName: from.id,
      target: "playerLeft",
      arguments: [userId, to.shortName],
    },
    {
      groupName: to.id,
      target: "playerEntered",
      arguments: [userId, from.shortName],
    },
  ];

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: from.id,
      action: "remove",
    },
    {
      userId,
      groupName: to.id,
      action: "add",
    },
  ];
};

export default httpTrigger;
