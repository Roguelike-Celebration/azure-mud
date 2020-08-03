import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { RoomResponse } from "../src/types";
import { addUserToRoomPresence } from "../src/roomPresence";
import authenticate from "../src/authenticate";
import { activeUserMap, minimizeUser, isMod } from "../src/user";
import { userHeartbeatReceived } from "../src/heartbeat";
import setUpRoomsForUser from "../src/setUpRoomsForUser";
import { roomData } from "../src/room";
import {
  globalPresenceMessage,
  allPresenceData,
} from "../src/globalPresenceMessage";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  await authenticate(context, req, async (user) => {
    context.log("We have a user!", user.id);
    await addUserToRoomPresence(user.id, user.roomId);
    await userHeartbeatReceived(user.id);

    const userMap = await activeUserMap();
    context.res = {
      status: 200,
      body: {
        roomId: user.room.id,
        presenceData: await allPresenceData(),
        users: userMap,
        roomData,
      } as RoomResponse,
    };

    const actions = [
      ...setUpRoomsForUser(user.id, user.roomId),
      {
        userId: user.id,
        groupName: "users",
        action: "add",
      },
      {
        userId: user.id,
        groupName: user.roomId,
        action: "add",
      },
    ];

    if (isMod(user.id)) {
      actions.push({
        userId: user.id,
        groupName: "mods",
        action: "add",
      });
    }

    context.bindings.signalRGroupActions = actions;

    context.log("Setting messages");

    const minimalUser = minimizeUser(user);

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: "playerConnected",
        arguments: [minimalUser],
      },
      {
        groupName: "users",
        target: "usernameMap",
        arguments: [{ [user.id]: minimalUser }],
      },
      await globalPresenceMessage([user.roomId]),
    ];

    context.log("Finished the thing");
    context.log(
      context.bindings.signalRMessages,
      context.bindings.signalRGroupActions
    );
  });
};

export default httpTrigger;
