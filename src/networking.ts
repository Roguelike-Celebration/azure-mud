import * as SignalR from "@aspnet/signalr";
const axios = require("axios").default;

import { RoomResponse, ErrorResponse } from "../server/src/types";
import { Dispatch } from "react";
import {
  Action,
  UpdatedRoomAction,
  ErrorAction,
  PlayerConnectedAction,
  PlayerDisconnectedAction,
  ChatMessageAction,
  PlayerEnteredAction,
  WhisperAction,
  PlayerLeftAction,
  ShoutAction,
  ShowProfileActionForFetchedUser,
  UserMapAction,
  ModMessageAction,
} from "./Actions";
import { User } from "../server/src/user";
import { startSignaling, receiveSignalData, getMediaStream } from "./webRTC";
import Config from "./config";
import { convertServerRoom } from "./room";

let myUserId: string;
let myDispatch: Dispatch<Action>;

let inMediaChat: boolean = false;

export async function connect(userId: string, dispatch: Dispatch<Action>) {
  myUserId = userId;
  myDispatch = dispatch;

  const result: RoomResponse = await callAzureFunction("connect");

  console.log(result);
  dispatch(UpdatedRoomAction(convertServerRoom(result)));
  dispatch(UserMapAction(result.users));

  connectSignalR(userId, dispatch);
}

export async function updateProfile(user: Partial<User>) {
  await callAzureFunction("updateProfile", { user });
}

export async function checkIsRegistered(): Promise<boolean> {
  const result = await callAzureFunction("isRegistered");
  return result.registered;
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
    myDispatch(UpdatedRoomAction(result));
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
    myDispatch(UpdatedRoomAction(convertServerRoom(result)));
  } else if (result && result.user) {
    myDispatch(ShowProfileActionForFetchedUser(result.user));
  } else if (result && result.error) {
    myDispatch(ErrorAction(result.error));
  }
}

export async function fetchProfile(userId: string): Promise<User | undefined> {
  const result = await callAzureFunction("fetchProfile", { userId });
  if (result.error) {
    console.log("Could not fetch profile", result.erroc);
  } else {
    return result.user;
  }
}

export async function toggleUserBan(userId: string) {
  const result = await callAzureFunction("banUser", { userId });
}

// WebRTC
// A note: the WebRTC handshake process generally avoids the Flux store / reducer
// The app store is only aware of actual video streams it has to present.

// This kicks off the whole peering process.
// Any connected WebRTC clients will start signaling, which happens over SignalR.
export async function startVideoChat() {
  inMediaChat = true;
  callAzureFunction("broadcastPeerId");

  // The act of fetching the local media stream triggers a local view of your webcam
  await getMediaStream(myDispatch);
}

export async function sendSignalData(peerId: string, data: string) {
  return await callAzureFunction("sendSignalData", { peerId, data });
}

export function setNetworkMediaChatStatus(isInMediaChat: boolean) {
  inMediaChat = isInMediaChat;
}

export function getNetworkMediaChatStatus(): boolean {
  return inMediaChat;
}

// Setup

async function connectSignalR(userId: string, dispatch: Dispatch<Action>) {
  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${Config.SERVER_HOSTNAME}/api`)
    .configureLogging(SignalR.LogLevel.Debug)
    .build();

  connection.on("playerConnected", (user) => {
    console.log("Player joined!", user);

    dispatch(PlayerConnectedAction(user));
  });

  connection.on("playerDisconnected", (otherId) => {
    console.log("Player left!", otherId);
    dispatch(PlayerDisconnectedAction(otherId));
  });

  connection.on("chatMessage", (otherId, message) => {
    console.log("Received chat", otherId, message);
    console.log(otherId, message, userId);
    if (otherId === userId) return;

    dispatch(ChatMessageAction(otherId, message));
  });

  connection.on("mods", (otherId, message) => {
    dispatch(ModMessageAction(otherId, message));
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

  connection.on("usernameMap", (map) => {
    console.log("Received map", map);
    dispatch(UserMapAction(map));
  });

  connection.on("shout", (name, message) => {
    // We don't gate on your own userId here.
    // Because shouting can fail at the server level, we don't show it preemptively.
    dispatch(ShoutAction(name, message));
  });

  connection.on("webrtcSignalData", (peerId, data) => {
    console.log("Received signaling data from", peerId);
    receiveSignalData(peerId, data, dispatch);
  });

  connection.on("webrtcPeerId", (peerId) => {
    if (peerId === userId) return;
    if (!inMediaChat) return;
    console.log("Starting signaling with", peerId);
    startSignaling(peerId, dispatch);
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
    .then(() => {
      console.log("Connected!");
    })
    .catch(console.error);
}

async function callAzureFunction(endpoint: string, body?: any): Promise<any> {
  try {
    const r = await axios.post(
      `${Config.SERVER_HOSTNAME}/api/${endpoint}`,
      body,
      { withCredentials: true }
    );
    console.log(r);
    return r.data;
  } catch (e) {
    console.log("Error", e);
    return undefined;
  }
}

export async function getLoginInfo() {
  try {
    console.log("Fetching");
    const r = await axios.post(`${Config.SERVER_HOSTNAME}/.auth/me`, null, {
      withCredentials: true,
    });
    console.log(r);
    return r.data[0];
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
