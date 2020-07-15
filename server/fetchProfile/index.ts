import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { PublicUser } from "../src/user";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const user: PublicUser = {
    id: "lazerwalker",
    realName: "Em Lazer-Walker",
    pronouns: "she/her or they/them",
    description:
      "She looks around bewildered, clearly not used to seeing the world in text form",
    askMeAbout: "Proc gen, tool-building, non-traditional interfaces!",
    twitterHandle: "lazerwalker",
    url: "https://lazerwalker.com",
  };

  context.res = {
    body: { user },
  };
};

export default httpTrigger;
