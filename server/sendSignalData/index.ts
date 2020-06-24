import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In sendSignalData");
  const peerId = req.body && req.body.peerId;
  const senderPeerId = req.body && req.body.senderPeerId;
  const data = req.body && req.body.data;

  if (!peerId) {
    context.res = { status: 403, body: "Pass in a peerId!" };
    return;
  }

  if (!data) {
    context.res = { status: 403, body: "Pass in signal data!" };
  }

  context.log("Peer Id?", peerId);

  context.res = {
    status: 200,
  };

  console.log("Setting group actions");

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      userId: peerId,
      target: "signal",
      arguments: [JSON.stringify({ data, peerId: senderPeerId })],
    },
  ];
};

export default httpTrigger;
