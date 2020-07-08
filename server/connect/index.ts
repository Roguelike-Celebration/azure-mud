import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ConnectResponse } from "../types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log("In connect");

  let userId = req.body && req.body.userId;
  if (!userId) {
    context.res = {
      status: 500,
      body: "You did not include a user ID",
    };
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
      target: "playerConnected",
      arguments: [userId],
    },
  ];
};

export default httpTrigger;
