import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { ConnectResponse } from "../types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.body && req.body.userId;
  let message = req.body && req.body.text;
  if (!userId) {
    context.res = {
      status: 500,
      body: "Include a user ID!",
    };
    return;
  }

  const roomName = "kitchen";

  context.res = {
    status: 200,
    body: {},
  };

  context.bindings.signalRMessages = [
    {
      groupName: roomName,
      target: "chatMessage",
      arguments: [userId, message],
    },
  ];
};

export default httpTrigger;
