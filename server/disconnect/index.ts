import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { removeUserFromRoomPresence } from "../src/roomPresence";
import { getActiveUsers, setActiveUsers } from "../src/heartbeat";
import authenticate from "../src/authenticate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, async (user) => {
    context.res = {
      status: 200,
    };

    await removeUserFromRoomPresence(user.id, user.roomId);

    let activeUsers = await getActiveUsers();
    if (activeUsers.includes(user.id)) {
      activeUsers = activeUsers.filter((u) => u !== user.id);
      await setActiveUsers(activeUsers);
    }

    context.bindings.signalRGroupActions = [
      {
        userId: user.id,
        groupName: "users",
        action: "remove",
      },
      {
        userId: user.id,
        groupName: user.roomId,
        action: "remove",
      },
    ];

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: "playerDisconnected",
        arguments: [user.id],
      },
    ];
  });
};

export default httpTrigger;
