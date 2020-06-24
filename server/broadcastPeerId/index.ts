import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In broadcastPeerId");
  const userId = req.body && req.body.peerId;

  if (!userId) {
    context.res = { status: 403, body: "Pass in a peerId!" };
    return;
  }

  context.log("Username?", userId);

  context.res = {
    status: 200,
  };

  console.log("Setting group actions");

  context.bindings.signalRGroupActions = {
    userId,
    groupName: "peers",
    action: "add",
  };

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      groupName: "peers",
      target: "peerConnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
