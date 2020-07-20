import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { hydrateUser } from "../src/hydrate";
import { moveToRoom } from "../src/moveToRoom";
import { whisper } from "../src/whisper";
import { shout } from "../src/shout";
import { look } from "../src/look";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.headers && req.headers["x-ms-client-principal-name"];
  let message = req.body && req.body.text;
  if (!userId || !message) {
    context.res = {
      status: 500,
      body: "Include a user ID and a message!",
    };
    return;
  }

  const user = await hydrateUser(userId);
  console.log("Got a user", JSON.stringify(user));
  const moveMatch = /^\/(go|move) (.+)/.exec(message);
  if (moveMatch) {
    return await moveToRoom(userId, moveMatch[2], context);
  }

  const whisperMatch = /^\/(whisper) (.+?) (.+)/.exec(message);
  if (whisperMatch) {
    return await whisper(user, whisperMatch[2], whisperMatch[3], context);
  }

  const shoutMatch = /^\/(shout) (.+)/.exec(message);
  if (shoutMatch) {
    return await shout(user, shoutMatch[2], context);
  }

  const lookMatch = /^\/(look) (.+)/.exec(message);
  if (lookMatch) {
    return await look(lookMatch[2], context);
  }

  context.res = {
    status: 200,
    body: {},
  };

  console.log(`Sending to ${user.roomId}: ${message} from ${user.id}`);

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: "chatMessage",
      arguments: [userId, message],
    },
  ];
};

export default httpTrigger;
