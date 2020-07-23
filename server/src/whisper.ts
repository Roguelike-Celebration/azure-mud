import { Context } from "@azure/functions";
import { invert } from "lodash";

import { User } from "./user";
import { activeUserMap } from "./hydrate";

export async function whisper(
  from: User,
  toUsername: string,
  message: string,
  context: Context
) {
  const userMap = invert(await activeUserMap());

  // TODO: Return this as metadata so the client can NameView the username
  if (!userMap[toUsername]) {
    context.res = {
      status: 200,
      body: {
        error: `${toUsername} is not online and will not receive your message.`,
      },
    };
    return;
  }

  context.bindings.signalRMessages = [
    {
      userId: userMap[toUsername],
      target: "whisper",
      arguments: [from.id, message],
    },
  ];

  context.res = {
    status: 200,
    body: {},
  };
}
