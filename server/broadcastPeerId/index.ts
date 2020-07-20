import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { hydrateUser } from "../src/hydrate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let userId = req.headers && req.headers["x-ms-client-principal-name"];
  if (!userId) {
    context.res = {
      status: 500,
      body: "You did not include a user ID",
    };
    return;
  }

  const user = await hydrateUser(userId);
  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: "webrtcPeerId",
      message: [userId],
    },
  ];
};

export default httpTrigger;
