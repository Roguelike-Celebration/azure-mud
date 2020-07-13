import { Context } from "@azure/functions";
import { roomData } from "./room";
import { RoomResponse } from "./types";
import { hydrateUser } from "./hydrate";
import {
  removeUserFromRoomPresence,
  addUserToRoomPresence,
} from "./roomPresence";

export async function moveToRoom(
  userId: string,
  newRoomId: string,
  context: Context
) {
  const user = await hydrateUser(userId);

  let to = roomData[newRoomId];
  if (!to) {
    // If the user typed a command, rather than clicking a link,
    // they may have typed a friendly version of the room name rather than the ID
    // TODO: Rooms should have a generous list of accepted names
    // DOUBLE TODO: Can we fuzzily search all exits for the current room?
    to = Object.values(roomData).find(
      (room) => room.shortName === newRoomId || room.displayName === newRoomId
    );
  }

  if (!to) {
    // If we STILL haven't found a room, it's possible the user typed the
    // green-colored link text in the scene, which might be unique.
    // Let's try to parse that out of the current room
    const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g;
    let result;
    while ((result = complexLinkRegex.exec(user.room.description))) {
      // "a [[foo->bar]]"" yields a result of ["[[friendly description->roomId]]", "friendly description", "roomId"]
      if (result[1] === newRoomId) {
        to = roomData[result[2]];
      }
    }
  }

  if (!to) {
    context.res = {
      status: 500,
      body: { error: "Invalid room ID" },
    };
    return;
  }

  await removeUserFromRoomPresence(userId, user.roomId);

  context.res = {
    status: 200,
    body: {
      room: to,
      roomOccupants: await addUserToRoomPresence(userId, to.id),
    } as RoomResponse,
  };

  context.bindings.signalRMessages = [
    {
      groupName: user.room.id,
      target: "playerLeft",
      arguments: [userId, to.shortName],
    },
    {
      groupName: to.id,
      target: "playerEntered",
      arguments: [userId, user.room.shortName],
    },
  ];

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: user.room.id,
      action: "remove",
    },
    {
      userId,
      groupName: user.room.id,
      action: "add",
    },
  ];
}
