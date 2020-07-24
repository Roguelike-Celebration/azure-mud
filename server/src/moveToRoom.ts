import { Context } from "@azure/functions";
import { roomData } from "./room";
import { RoomResponse } from "./types";
import {
  removeUserFromRoomPresence,
  addUserToRoomPresence,
} from "./roomPresence";
import { User } from "./user";

export async function moveToRoom(
  user: User,
  newRoomId: string,
  context: Context
) {
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

  await removeUserFromRoomPresence(user.id, user.roomId);

  context.res = {
    status: 200,
    body: {
      room: to,
      roomOccupants: await addUserToRoomPresence(user.id, to.id),
    } as RoomResponse,
  };

  context.bindings.signalRMessages = [
    {
      groupName: user.room.id,
      target: "playerLeft",
      arguments: [user.id, to.shortName],
    },
    {
      groupName: to.id,
      target: "playerEntered",
      arguments: [user.id, user.room.shortName],
    },
  ];

  context.bindings.signalRGroupActions = [
    {
      userId: user.id,
      groupName: user.room.id,
      action: "remove",
    },
    {
      userId: user.id,
      groupName: to.id,
      action: "add",
    },
  ];
}
