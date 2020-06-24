import {
  broadcastToPeers,
  registerAsClient,
  ReceivedDataHandler,
  ReceivedStreamHandler,
} from "./networking";

let mediaStream: MediaStream | undefined;

function truncatePeerId(peerId: string): string {
  let split = peerId.split("-");
  return split[0];
}

/******************************************************************************
 * Video chat functions
 ******************************************************************************/

const receivedStream: ReceivedStreamHandler = (
  peerId: string,
  stream: MediaStream
) => {
  const name = truncatePeerId(peerId);

  const wrapper = document.createElement("div");
  const video = document.createElement("video");
  const text = document.createElement("div");

  text.innerText = name;

  wrapper.className = "video-wrapper";
  wrapper.appendChild(video);
  wrapper.appendChild(text);
  wrapper.id = `wrapper-${name}`;

  video.id = `video-${name}`;
  video.srcObject = stream;
  video.play();

  document.getElementById("videos").appendChild(wrapper);
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

    const name = "you";

    const wrapper = document.createElement("div");
    const video = document.createElement("video");
    const text = document.createElement("div");

    text.innerText = name;

    wrapper.className = "video-wrapper";
    wrapper.appendChild(video);
    wrapper.appendChild(text);
    wrapper.id = `wrapper-${name}`;

    video.id = `video-${name}`;
    video.srcObject = stream;

    document.getElementById("videos").appendChild(wrapper);

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

/******************************************************************************
 * Text chat functions
 ******************************************************************************/

const receivedData: ReceivedDataHandler = (peerId: string, data: string) => {
  console.log(`Received data from ${peerId}`, data);
  displayChatMessage(truncatePeerId(peerId), data);
};

const sendChatMessage = () => {
  const input: HTMLInputElement = document.querySelector("#chat-input");
  const text = input.value;

  if (text === "" || text === undefined) return;

  broadcastToPeers(text);
  displayChatMessage("you", text);

  input.value = "";
};

const displayChatMessage = (peerId: string, msg: string) => {
  const message = `${peerId}: ${msg}`;
  const el = document.createElement("div");
  el.innerHTML = `<strong>${peerId}:</strong> ${msg}`;

  document.getElementById("messages").prepend(el);
};

window.addEventListener("DOMContentLoaded", () => {
  getMediaStream();
  document.getElementById("send").addEventListener("click", sendChatMessage);
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  });
});
