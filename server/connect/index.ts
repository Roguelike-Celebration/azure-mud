import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { RoomResponse } from "../src/types";
import removeUserFromAllRooms from "../src/removeUserFromAllRooms";
import { addUserToRoomPresence } from "../src/roomPresence";
import { setUserHeartbeat } from "../src/heartbeat";
import authenticate from "../src/authenticate";
import { activeUserMap } from "../src/user";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  await authenticate(context, req, async (user) => {
    context.log("We have a user!", user.id);
    const roomOccupants = await addUserToRoomPresence(user.id, user.roomId);
    await setUserHeartbeat(user.id);

    const userMap = await activeUserMap();
    context.res = {
      status: 200,
      body: {
        room: user.room,
        roomOccupants,
        users: userMap,
      } as RoomResponse,
    };

    context.bindings.signalRGroupActions = [
      ...removeUserFromAllRooms(user.id, user.roomId),
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

    context.log("Setting messages");

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: "playerConnected",
        arguments: [user.id, user.username],
      },
    ];

    context.log("Finished the thing");
    context.log(
      context.bindings.signalRMessages,
      context.bindings.signalRGroupActions
    );
  });
};

export default httpTrigger;
