import { connect, NetworkingDelegate } from "./networking";

function truncatePeerId(peerId: string): string {
  let split = peerId.split("-");
  return split[0];
}

const delegate: NetworkingDelegate = {
  updatedRoom: (name: string, description: string) => {
    document.getElementById("room-name").innerText = name;
    document.getElementById("static-room-description").innerHTML = description;
  },

  updatedPresenceInfo: (users: string[]) => {
    let names = "";
    if (users.length === 0) {
      document.getElementById("dynamic-room-description").innerText =
        "You are all alone here.";
      return;
    }

    if (users.length === 1) {
      names = users[0];
    } else if (users.length === 2) {
      names = `${users[0]} and ${users[1]}`;
    } else {
      names = `${users.slice(0, users.length - 1).join(", ")}, and ${
        users[users.length - 1]
      }`;
    }
    document.getElementById(
      "dynamic-room-description"
    ).innerHTML = `Also here are ${names}`;
  },
};

const receivedData = (peerId: string, data: string) => {
  console.log(`Received data from ${peerId}`, data);
  displayChatMessage(truncatePeerId(peerId), data);
};

const sendChatMessage = () => {
  const input: HTMLInputElement = document.querySelector("#chat-input");
  const text = input.value;

  if (text === "" || text === undefined) return;

  //broadcastToPeers(text);
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
  connect(delegate);
});
