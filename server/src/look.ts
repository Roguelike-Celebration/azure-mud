import { Context } from "@azure/functions";
import { getPublicUser } from "./user";

export async function look(target: string, context: Context) {
  const profile = await getPublicUser(target);

  context.res = {
    status: 200,
    body: { user: profile },
  };
}
