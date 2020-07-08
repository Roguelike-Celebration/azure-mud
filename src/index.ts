import { connect, NetworkingDelegate } from "./networking";

function truncatePeerId(peerId: string): string {
  let split = peerId.split("-");
  return split[0];
}

let currentOtherPlayers: string[] = [];

function renderPresence(users: string[]) {
  console.log("Rendering presence", users);
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
}

const delegate: NetworkingDelegate = {
  updatedRoom: (name: string, description: string) => {
    document.getElementById("room-name").innerText = name;
    document.getElementById("static-room-description").innerHTML = description;
  },

  updatedPresenceInfo: (users: string[]) => {
    currentOtherPlayers = users;
    renderPresence(users);
  },

  playerConnected: (name: string) => {
    let truncatedName = truncatePeerId(name);
    console.log("In playerJoined", name);
    if (currentOtherPlayers.indexOf(truncatedName) === -1) {
      currentOtherPlayers.push(truncatedName);
    }

    renderPresence(currentOtherPlayers);
  },

  playerDisconnected: (name: string) => {
    let truncatedName = truncatePeerId(name);
    currentOtherPlayers = currentOtherPlayers.filter(
      (p) => p !== truncatedName
    );
    renderPresence(currentOtherPlayers);
  },

  chatMessageReceived: (name: string, message: string) => {
    const el = document.createElement("div");
    el.innerHTML = `<strong>${truncatePeerId(name)}:</strong> ${message}`;
    document.getElementById("messages").append(el);
  },
};

const sendChatMessage = () => {
  const input: HTMLInputElement = document.querySelector("#chat-input");
  const text = input.value;

  if (text === "" || text === undefined) return;

  //broadcastToPeers(text);
  displayChatMessage("you", text);

  input.value = "";
};

const displayChatMessage = (peerId: string, msg: string) => {};

window.addEventListener("DOMContentLoaded", () => {
  connect(delegate);
});
