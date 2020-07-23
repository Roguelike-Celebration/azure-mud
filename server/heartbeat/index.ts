import { AzureFunction, Context } from "@azure/functions";
import { removeUserFromRoomPresence } from "../src/roomPresence";
import { hydrateUser } from "../src/hydrate";
import { getHeartbeatData, setActiveUsers } from "../src/heartbeat";

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  const thresholdSeconds = 90;

  var timeStamp = new Date().toISOString();

  if (myTimer.IsPastDue) {
    context.log("Timer function is running late!");
  }
  context.log("Timer function ran!", timeStamp);

  const data = await getHeartbeatData();
  context.log("HEARTBEAT DATA", data);

  const now = new Date();
  const nowValue = now.valueOf();

  let activeUsers = [];
  let usersToRemove = [];
  Object.keys(data).forEach((user) => {
    const time = data[user];
    const diff = nowValue - time;
    if (Math.floor(diff / 1000) > thresholdSeconds) {
      usersToRemove.push(user);
    } else {
      activeUsers.push(user);
    }
  });

  let signalRGroupActions = [];
  for (let i = 0; i < usersToRemove.length; i++) {
    const userId = usersToRemove[i];
    const user = await hydrateUser(userId);
    await removeUserFromRoomPresence(userId, user.roomId);
    signalRGroupActions.push(
      {
        userId,
        groupName: "users",
        action: "remove",
      },
      {
        userId,
        groupName: user.roomId,
        action: "remove",
      }
    );
  }

  if (usersToRemove.length > 0) {
    context.log(
      `Removing the following inactive users: ${usersToRemove.join(", ")}`
    );
  }

  await setActiveUsers(activeUsers);

  context.bindings.signalRGroupActions = signalRGroupActions;
  context.bindings.signalRMessages = [
    {
      groupName: "users",
      target: "ping",
      arguments: [],
    },
  ];
};

export default timerTrigger;
