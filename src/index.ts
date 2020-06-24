import {
  broadcastToPeers,
  registerAsClient,
  ReceivedDataHandler,
  ReceivedStreamHandler,
} from "./networking";

let mediaStream: MediaStream | undefined;

const receivedData: ReceivedDataHandler = (peerId: string, data: string) => {
  console.log(`Received data from ${peerId}`, data);
};

const receivedStream: ReceivedStreamHandler = (
  peerId: string,
  stream: MediaStream
) => {
  const video = document.createElement("video");
  document.getElementById("wrapper").appendChild(video);

  video.id = `video-${peerId}`;
  video.srcObject = stream;
  video.play();
};

const getMediaStream = async (): Promise<MediaStream | undefined> => {
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

    const video: HTMLVideoElement = document.querySelector("#webcam");
    video.srcObject = stream;
    video.onloadedmetadata = async (e) => {
      video.play();

      registerAsClient(stream, { receivedData, receivedStream });
    };
  } catch (err) {
    console.log("Video error", err);
    /* handle the error */
  }

  mediaStream = stream;

  return stream;
};

window.addEventListener("DOMContentLoaded", () => {
  getMediaStream();
});
