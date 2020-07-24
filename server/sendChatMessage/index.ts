import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { moveToRoom } from "../src/moveToRoom";
import { whisper } from "../src/whisper";
import { shout } from "../src/shout";
import { look } from "../src/look";
import authenticate from "../src/authenticate";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, async (user) => {
    let message = req.body && req.body.text;
    if (!message) {
      context.res = {
        status: 500,
        body: "Include a user ID and a message!",
      };
      return;
    }

    const moveMatch = /^\/(go|move) (.+)/.exec(message);
    if (moveMatch) {
      return await moveToRoom(user, moveMatch[2], context);
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

    context.log(`Sending to ${user.roomId}: ${message} from ${user.id}`);

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: "chatMessage",
        arguments: [user.id, message],
      },
    ];
  });
};

export default httpTrigger;
