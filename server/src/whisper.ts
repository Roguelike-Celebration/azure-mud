import { User } from "./user";
import { Context } from "@azure/functions";

export function whisper(
  from: User,
  toId: string,
  message: string,
  context: Context
) {
  // For now, we naively assume the 'to' user exists,
  // and if they don't their message disappears.

  // Ideally we'd tell a player if they whispered someone who doesn't exist.
  // We don't currently have infrastructure around "is this player online?"
  // (but should!)

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
