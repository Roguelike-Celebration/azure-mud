import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { hydrateUser } from "../src/hydrate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let userId = req.headers && req.headers["x-ms-client-principal-id"];
  if (!userId) {
    context.res = {
      status: 500,
      body: "You did not include a user ID",
    };
    return;
  }

  let { peerId, data } = req.body;
  if (!peerId || !data) {
    context.res = {
      status: 400,
      body: "You did not include a peer ID or data",
    };
  }

  context.bindings.signalRMessages = [
    {
      userId: peerId,
      target: "webrtcSignalData",
      message: [userId, data],
    },
  ];
};

export default httpTrigger;
