import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { ConnectResponse } from "../types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.body && req.body.userId;
  if (!userId) {
    userId = uuidv4();
  }

  const roomName = "kitchen";

  context.res = {
    status: 200,
  };

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: "users",
      action: "remove",
    },
    {
      userId,
      groupName: roomName,
      action: "remove",
    },
  ];

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      groupName: roomName,
      target: "playerDisconnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
