import { Context } from "@azure/functions";

export default async function logSignalR(
  context: Context,
  handler: () => void
) {
  await handler();
  context.log("HTTP response", context.res);
  context.log("Group actions", context.bindings.signalRGroupActions);
  context.log("Messages", context.bindings.signalRMessages);
}
