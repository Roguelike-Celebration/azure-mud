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
  const roomFriendlyName = "GitHub HQ: Kitchen";
  const roomDescription = `A series of long picnic tables made of rustic wood abut a stainless steel kitchen island. On the island are a few samovars of Sightglass coffee — don't worry, there's plenty of decaf too — and hot water for tea, plus a few trays of Arizmendi pastries.`;
  const roomOccupants = ["lazerwalker", "swartzcr", "kawa"];

  context.res = {
    status: 200,
    body: {
      userId,
      roomName,
      roomFriendlyName,
      roomDescription,
      roomOccupants,
    } as ConnectResponse,
  };

  context.bindings.signalRGroupActions = [
    {
      userId,
      groupName: "users",
      action: "add",
    },
    {
      userId,
      groupName: roomName,
      action: "add",
    },
  ];

  console.log("Setting messages");

  context.bindings.signalRMessages = [
    {
      groupName: roomName,
      target: "playerJoined",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
