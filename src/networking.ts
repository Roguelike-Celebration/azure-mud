import Peer from "simple-peer";
import * as SignalR from "@aspnet/signalr";
import { v4 as uuidv4 } from "uuid";

export type ReceivedDataHandler = (peerId: string, data: string) => void;
export type ReceivedStreamHandler = (
  peerId: string,
  stream: MediaStream
) => void;

let peers: { [id: string]: Peer } = {};
let stream: MediaStream | undefined;

let myPeerId: string | undefined;

let receivedDataHandler: ReceivedDataHandler | undefined;
let receivedStreamHandler: ReceivedStreamHandler | undefined;

export function sendToPeer(id: string, msg: string) {
  peers[id].send(msg);
}

export function broadcastToPeers(msg: string) {
  Object.values(peers).forEach((c) => {
    if (!c.connected) return;
    c.send(msg);
  });
}

async function beginSignalingWithPeer(peerId: string) {
  const peer = new Peer({ initiator: true, stream });
  peers[peerId] = peer;
  setUpPeer(peerId, peer);
}

function setUpPeer(peerId: string, peer: Peer) {
  peer.on("signal", (data) => {
    console.log("SIGNAL", JSON.stringify(data));
    callAzureFunction("sendSignalData", {
      data,
      peerId,
      senderPeerId: myPeerId,
    });
  });

  peer.on("connect", () => {
    console.log(`Peer ${peerId} connected!`);
  });

  peer.on("data", (data) => {
    // console.log("Received data", peerId, data);
    receivedDataHandler(peerId, data);
  });

  peer.on("stream", (stream) => {
    console.log("Received stream", peerId);
    receivedStreamHandler(peerId, stream);
  });
}

async function connectSignalR(uuid: string) {
  class CustomHttpClient extends SignalR.DefaultHttpClient {
    public send(request: SignalR.HttpRequest): Promise<SignalR.HttpResponse> {
      request.headers = {
        ...request.headers,
        "x-ms-client-principal-id": uuid,
      };
      return super.send(request);
    }
  }

  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(`https://spatial-webrtc-test.azurewebsites.net/api`, {
      httpClient: new CustomHttpClient(console),
    })
    .configureLogging(SignalR.LogLevel.Information)
    .build();

  connection.on("peerConnected", (peerId) => {
    console.log("got a peer to connect to!", peerId);
    if (peerId !== uuid) {
      beginSignalingWithPeer(peerId);
    } else {
      console.log("That was ourself. Ignoring.");
    }
  });

  connection.on("signal", (json) => {
    const { data, peerId } = JSON.parse(json);
    console.log("Received signaling data!", peerId, data);

    let peer = peers[peerId];
    if (!peer) {
      peer = new Peer({ stream });
      peers[peerId] = peer;
      setUpPeer(peerId, peer);
    }

    peer.signal(data);
  });

  connection.on("irrelevant", (data) => {
    console.log("Irrelevant", data);
  });

  connection.onclose(() => console.log("disconnected"));

  console.log("connecting...");
  return await connection
    .start()
    .then(() => console.log("Connected!"))
    .catch(console.error);
}

export async function registerAsClient(
  audioStream?: MediaStream,
  handlers?: {
    receivedData?: ReceivedDataHandler;
    receivedStream?: ReceivedStreamHandler;
  }
) {
  stream = audioStream;
  const id = uuidv4();
  myPeerId = id;
  await connectSignalR(id);

  callAzureFunction("broadcastPeerId", { peerId: id });

  if (handlers) {
    receivedDataHandler = handlers.receivedData;
    receivedStreamHandler = handlers.receivedStream;
  }
}

function callAzureFunction(
  endpoint: string,
  body?: any,
  options?: Partial<RequestInit>
) {
  let opts = {
    method: "POST",
    credentials: "include" as RequestCredentials, // sigh
    ...options,
  };

  if (body) {
    opts.body = JSON.stringify(body);
  }

  return fetch(
    `https://spatial-webrtc-test.azurewebsites.net/api/${endpoint}`,
    opts
  ).then((r) => {
    if (r.ok) {
      console.log("Updated", r);
    } else {
      console.error("Update failed", r);
    }
  });
}
