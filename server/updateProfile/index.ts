import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import authenticate from "../src/authenticate";
import { User, updateUserProfile } from "../src/user";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, (user) => {
    const data: Partial<User> = req.body && req.body.user;
    if (!data) {
      context.res = {
        status: 400,
        body: "Include profile data!",
      };
      return;
    }

    const twitterHandle =
      req.headers && req.headers["x-ms-client-principal-name"];
    if (twitterHandle) {
      data.twitterHandle = twitterHandle;
    }

    return updateUserProfile(user.id, data);
  });
};

export default httpTrigger;
