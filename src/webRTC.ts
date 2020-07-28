import SimplePeer from "simple-peer";
import { sendSignalData } from "./networking";
import { Dispatch } from "react";
import {
  Action,
  LocalMediaStreamOpenedAction,
  P2PDataReceivedAction,
  P2PStreamReceivedAction,
  P2PConnectionClosedAction,
} from "./Actions";

let mediaStream: MediaStream;

export function localMediaStream(): MediaStream | undefined {
  return mediaStream;
}

export function otherMediaStreams(): { [id: string]: MediaStream } {
  return peerStreams;
}

export const getMediaStream = async (
  dispatch?: Dispatch<Action>
): Promise<MediaStream | undefined> => {
  console.log("Trying to open media stream");
  if (mediaStream) {
    return mediaStream;
  }

  let stream: MediaStream = null;

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

  if (dispatch) {
    dispatch(LocalMediaStreamOpenedAction());
  }

  return stream;
};

export async function toggleVideo(newState: boolean) {
  const stream = await getMediaStream();
  const track = stream.getVideoTracks()[0];
  if (!track) {
    console.log("Error: No video track!");
    return;
  }

  track.enabled = !newState;
}

export async function toggleAudio(newState: boolean) {
  const stream = await getMediaStream();
  const track = stream.getAudioTracks()[0];
  if (!track) {
    console.log("Error: No video track!");
    return;
  }

  track.enabled = !newState;
}

export async function startSignaling(
  peerId: string,
  dispatch: Dispatch<Action>
) {
  const stream = await getMediaStream(dispatch);
  const peer = new SimplePeer({ initiator: true, stream });
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
    peer = new SimplePeer({ stream });
    peers[peerId] = peer;
    setUpPeer(peerId, peer, dispatch);
  }

  peer.signal(data);
}

let peers: { [id: string]: SimplePeer.Instance } = {};
let peerStreams: { [id: string]: MediaStream } = {};

export function sendToPeer(id: string, msg: string) {
  peers[id].send(msg);
}

export function broadcastToPeers(msg: string) {
  Object.values(peers).forEach((c) => {
    if (!c.writable) return;
    c.send(msg);
  });
}

export function disconnectAllPeers() {
  Object.values(peers).forEach((p) => {
    p.destroy();
  });
}

function setUpPeer(
  peerId: string,
  peer: SimplePeer.Instance,
  dispatch: Dispatch<Action>
) {
  peer.on("signal", (data) => {
    console.log("SIGNAL", JSON.stringify(data));

    sendSignalData(peerId, data);
  });

  peer.on("connect", () => {
    console.log(`Peer ${peerId} connected!`);
  });

  peer.on("close", () => {
    console.log("WebRTC peer closed", peerId);
    delete peers[peerId];
    delete peerStreams[peerId];
    dispatch(P2PConnectionClosedAction(peerId));
  });

  peer.on("err", (e) => {
    console.log("Peer errored out", peerId, e);
    delete peers[peerId];
    delete peerStreams[peerId];
    dispatch(P2PConnectionClosedAction(peerId));
  });

  peer.on("data", (data) => {
    console.log("Received data from peer", data);
    dispatch(P2PDataReceivedAction(peerId, data));
  });

  peer.on("stream", (stream) => {
    console.log("Received stream", peerId);
    peerStreams[peerId] = stream;
    dispatch(P2PStreamReceivedAction(peerId));
  });
}
