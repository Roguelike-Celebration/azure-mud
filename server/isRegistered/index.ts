import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import authenticate from "../src/authenticate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, (user) => {
    context.res = {
      status: 200,
      body: { registered: !!user.username },
    };
  });
};

export default httpTrigger;
