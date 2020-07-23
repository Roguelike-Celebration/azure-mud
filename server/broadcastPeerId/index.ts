import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { hydrateUser } from "../src/hydrate";
import authenticate from "../src/authenticate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, (user) => {
    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: "webrtcPeerId",
        message: [user.id],
      },
    ];
  });
};

export default httpTrigger;
