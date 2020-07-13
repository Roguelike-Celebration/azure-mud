import { User } from "./user";
import { Context } from "@azure/functions";
import { getActiveUsers } from "./heartbeat";

export async function whisper(
  from: User,
  toId: string,
  message: string,
  context: Context
) {
  const activeUsers = await getActiveUsers();

  // TODO: Make this its own action so we can NameView-ify the name
  if (!activeUsers.includes(toId)) {
    context.res = {
      status: 200,
      body: {
        error: `${toId} is not online and will not receive your message.`,
      },
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      userId: toId,
      target: "whisper",
      arguments: [from.id, message],
    },
  ];

  context.res = {
    status: 200,
    body: {},
  };
}
