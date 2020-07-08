import * as SignalR from "@aspnet/signalr";
import { ConnectResponse } from "../server/types";

export interface NetworkingDelegate {
  updatedRoom: (name: string, description: string) => void;
  updatedPresenceInfo: (users: string[]) => void;
  playerConnected: (name: string) => void;
  playerDisconnected: (name: string) => void;
  chatMessageReceived: (name: string, message: string) => void;
}

let myUserId: string;

export async function connect(userId: string, delegate: NetworkingDelegate) {
  myUserId = userId;

  const result: ConnectResponse = await callAzureFunction("connect");

  console.log(result);
  delegate.updatedRoom(result.roomFriendlyName, result.roomDescription);
  delegate.updatedPresenceInfo(result.roomOccupants);

  connectSignalR(userId, delegate);
}

export function sendChatMessage(text: string) {
  callAzureFunction("sendChatMessage", { text });
}

async function connectSignalR(userId: string, delegate: NetworkingDelegate) {
  class CustomHttpClient extends SignalR.DefaultHttpClient {
    public send(request: SignalR.HttpRequest): Promise<SignalR.HttpResponse> {
      request.headers = {
        ...request.headers,
        "x-ms-client-principal-id": userId,
      };
      return super.send(request);
    }
  }

  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(`https://mud.azurewebsites.net/api`, {
      httpClient: new CustomHttpClient(console),
    })
    .configureLogging(SignalR.LogLevel.Information)
    .build();

  connection.on("playerConnected", (otherId) => {
    console.log("Player joined!", otherId);
    delegate.playerConnected(otherId);
  });

  connection.on("playerDisconnected", (otherId) => {
    console.log("Player left!", otherId);
    delegate.playerDisconnected(otherId);
  });

  connection.on("chatMessage", (otherId, message) => {
    console.log(otherId, message);
    if (otherId === userId) return;
    delegate.chatMessageReceived(otherId, message);
  });

  connection.onclose(() => {
    console.log("disconnected");
    callAzureFunction("disconnect");
  });

  window.addEventListener("beforeunload", (e) => {
    callAzureFunction("disconnect");
  });

  console.log("connecting...");
  return await connection
    .start()
    .then(() => console.log("Connected!"))
    .catch(console.error);
}

async function callAzureFunction(
  endpoint: string,
  body?: any,
  options?: Partial<RequestInit>
): Promise<any> {
  let opts = {
    method: "POST",
    credentials: "include" as RequestCredentials, // sigh
    ...options,
  };

  opts.body = JSON.stringify({ ...(body || {}), userId: myUserId });

  return fetch(`https://mud.azurewebsites.net/api/${endpoint}`, opts).then(
    (r) => {
      if (r.ok) {
        console.log("Updated", r);
      } else {
        console.error("Update failed", r);
      }

      return r.json();
    }
  );
}
