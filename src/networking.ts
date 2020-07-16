import * as SignalR from "@aspnet/signalr";
import { RoomResponse, ErrorResponse } from "../server/src/types";
import { Dispatch } from "react";
import {
  Action,
  UpdatedRoomAction,
  UpdatedPresenceAction,
  ErrorAction,
  PlayerConnectedAction,
  PlayerDisconnectedAction,
  ChatMessageAction,
  PlayerEnteredAction,
  WhisperAction,
  PlayerLeftAction,
  ShoutAction,
} from "./Actions";
import { User } from "../server/src/user";

export interface NetworkingDelegate {
  updatedRoom: (name: string, description: string) => void;
  updatedPresenceInfo: (users: string[]) => void;
  playerConnected: (name: string) => void;
  playerDisconnected: (name: string) => void;
  chatMessageReceived: (name: string, message: string) => void;
  whisperReceived: (name: string, message: string) => void;
  playerEntered: (name: string, from: string) => void;
  playerLeft: (name: string, to: string) => void;
  statusMessageReceived: (message: string) => void;
}

let myUserId: string;
let myDispatch: Dispatch<Action>;

export async function connect(userId: string, dispatch: Dispatch<Action>) {
  myUserId = userId;
  myDispatch = dispatch;

  const result: RoomResponse = await callAzureFunction("connect");

  console.log(result);
  dispatch(UpdatedRoomAction(result.room.displayName, result.room.description));
  dispatch(UpdatedPresenceAction(result.roomOccupants));

  connectSignalR(userId, dispatch);
}

export async function moveToRoom(roomId: string) {
  const result: RoomResponse | ErrorResponse | any = await callAzureFunction(
    "moveRoom",
    {
      to: roomId,
    }
  );

  console.log(result);

  if (result.error) {
    myDispatch(ErrorAction(result.error));
  } else {
    myDispatch(
      UpdatedRoomAction(result.room.displayName, result.room.description)
    );
    myDispatch(UpdatedPresenceAction(result.roomOccupants));
  }
}

export async function sendChatMessage(text: string) {
  const result: RoomResponse | Error | any = await callAzureFunction(
    "sendChatMessage",
    {
      text,
    }
  );

  console.log(result);

  // If it's a /move command
  if (result && result.room && result.roomOccupants) {
    myDispatch(
      UpdatedRoomAction(result.room.displayName, result.room.description)
    );
    myDispatch(UpdatedPresenceAction(result.roomOccupants));
  } else if (result && result.error) {
    myDispatch(ErrorAction(result.error));
  }
}

export async function fetchProfile(userId: string): Promise<User | undefined> {
  const result = await callAzureFunction("fetchProfile", {
    userIdToFetch: userId,
  });
  if (result.error) {
    console.log("Could not fetch profile", result.erroc);
  } else {
    return result.user;
  }
}

async function connectSignalR(userId: string, dispatch: Dispatch<Action>) {
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
    .withUrl(`https://mud.azurewebsites.net/api`)
    .configureLogging(SignalR.LogLevel.Information)
    .build();

  connection.on("playerConnected", (otherId) => {
    console.log("Player joined!", otherId);

    dispatch(PlayerConnectedAction(otherId));
  });

  connection.on("playerDisconnected", (otherId) => {
    console.log("Player left!", otherId);
    dispatch(PlayerDisconnectedAction(otherId));
  });

  connection.on("chatMessage", (otherId, message) => {
    console.log("Received chat", otherId, message);
    console.log(otherId, message);
    if (otherId === userId) return;

    dispatch(ChatMessageAction(otherId, message));
  });

  connection.on("playerEntered", (name, from) => {
    if (name === userId) return;
    dispatch(PlayerEnteredAction(name, from));
  });

  connection.on("whisper", (otherId, message) => {
    dispatch(WhisperAction(otherId, message));
  });

  connection.on("playerLeft", (name, to) => {
    if (name === userId) return;
    dispatch(PlayerLeftAction(name, to));
  });

  connection.on("shout", (name, message) => {
    // We don't gate on your own userId here.
    // Because shouting can fail at the server level, we don't show it preemptively.
    dispatch(ShoutAction(name, message));
  });

  connection.onclose(() => {
    console.log("disconnected");
    callAzureFunction("disconnect");
  });

  connection.on("ping", () => {
    console.log("Received heartbeat ping");
    callAzureFunction("pong");
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

  const r = await fetch(`https://mud.azurewebsites.net/api/${endpoint}`, opts);
  if (r.ok) {
    console.log("Updated", r);
  } else {
    console.error("Update failed", r);
  }

  return r.json();
}

export async function getLoginInfo() {
  console.log("Fetching");
  const r = await fetch(`https://mud.azurewebsites.net/.auth/me`);
  if (r.ok) {
    console.log("Data", r);
  } else {
    console.log("Error", r);
  }
  return r.json();
}
