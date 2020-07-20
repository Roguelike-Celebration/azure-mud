import Peer from "simple-peer";
import { sendSignalData } from "./networking";
import { Dispatch } from "react";
import { Action } from "./Actions";

// TODO: How am I threading through a dispatch function to this?

let mediaStream: MediaStream;
const getMediaStream = async (
  dispatch: Dispatch<Action>
): Promise<MediaStream | undefined> => {
  console.log("Getting media stream");
  if (mediaStream) {
    return mediaStream;
  }

  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: "user" },
    });
  } catch (err) {
    console.log("Video error", err);
    /* handle the error */
  }

  mediaStream = stream;

  // TODO: Dispatch a stream action that sets the media stream

  return stream;
};

export async function startSignaling(
  peerId: string,
  dispatch: Dispatch<Action>
) {
  const stream = await getMediaStream(dispatch);
  const peer = new Peer({ initiator: true, stream });
  peers[peerId] = peer;
  setUpPeer(peerId, peer, dispatch);
}

export async function receiveSignalData(
  peerId: string,
  data: string,
  dispatch: Dispatch<Action>
) {
  const stream = await getMediaStream(dispatch);
  let peer = peers[peerId];
  if (!peer) {
    peer = new Peer({ stream });
    peers[peerId] = peer;
    setUpPeer(peerId, peer, dispatch);
  }

  peer.signal(data);
}

let peers: { [id: string]: Peer } = {};

export function sendToPeer(id: string, msg: string) {
  peers[id].send(msg);
}

export function broadcastToPeers(msg: string) {
  Object.values(peers).forEach((c) => {
    if (!c.connected) return;
    c.send(msg);
  });
}

function setUpPeer(peerId: string, peer: Peer, dispatch: Dispatch<Action>) {
  peer.on("signal", (data) => {
    console.log("SIGNAL", JSON.stringify(data));

    sendSignalData(peerId, data);
  });

  peer.on("connect", () => {
    console.log(`Peer ${peerId} connected!`);
  });

  peer.on("data", (data) => {
    // TODO: Dispatch a data action
    // receivedDataHandler(peerId, data);
  });

  peer.on("stream", (stream) => {
    console.log("Received stream", peerId);
    // TODO: Dispatch a stream action that sets the media stream
    // receivedStreamHandler(peerId, stream);
  });
}
