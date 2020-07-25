import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { moveToRoom } from "../src/moveToRoom";
import { whisper } from "../src/whisper";
import { shout } from "../src/shout";
import { look } from "../src/look";
import authenticate from "../src/authenticate";
import { getUserIdForUsername } from "../src/user";

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

    const modMatch = /^\/(mod) (.+)/.exec(message);
    if (modMatch) {
      // Send to the mod-only group
      context.bindings.signalRMessages = [
        {
          groupName: user.roomId,
          target: "mods",
          arguments: [user.id, modMatch[2]],
        },
      ];
      return;
    }

    const lookMatch = /^\/(look) (.+)/.exec(message);
    if (lookMatch) {
      const lookUserId = await getUserIdForUsername(lookMatch[2]);
      if (!lookMatch) {
        context.res = {
          status: 400,
          body: { error: `Could not find the user ${lookMatch[2]}` },
        };
        return;
      }
      return await look(lookUserId, context);
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
