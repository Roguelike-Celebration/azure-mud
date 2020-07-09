import {
  connect,
  NetworkingDelegate,
  sendChatMessage,
  moveToRoom,
} from "./networking";

let currentOtherPlayers: string[] = [];

function renderPresence(users: string[]) {
  console.log("Rendering presence", users);
  users = users.filter((u) => u !== localStorage.getItem("name"));
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
  document.getElementById("dynamic-room-description").innerHTML = `Also here ${
    users.length === 1 ? "is" : "are"
  } ${names}`;
}

const delegate: NetworkingDelegate = {
  updatedRoom: (name: string, description: string) => {
    const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g;
    const simpleLinkRegex = /\[\[(.+?)\]\]/g;

    console.log("Updating room", name, description);
    description = description.replace(
      complexLinkRegex,
      (match, text, roomId) => {
        console.log("Replacing complex", match, text, roomId);
        return `<a class='room-link' href='#' data-room='${roomId}'>${text}</a>`;
      }
    );

    description = description.replace(simpleLinkRegex, (match, roomId) => {
      console.log("Replacing simple", match, roomId);
      return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}</a>`;
    });

    document.getElementById("room-name").innerText = name;
    document.getElementById("static-room-description").innerHTML = description;

    document
      .querySelectorAll("#static-room-description .room-link")
      .forEach((el) =>
        el.addEventListener("click", (e) => {
          const roomId = el.getAttribute("data-room");
          moveToRoom(roomId);
        })
      );
  },

  updatedPresenceInfo: (users: string[]) => {
    currentOtherPlayers = users;
    renderPresence(users);
  },

  playerConnected: (name: string) => {
    console.log("In playerJoined", name);
    if (currentOtherPlayers.indexOf(name) === -1) {
      currentOtherPlayers.push(name);
      displayChatMessage(`<strong>${name}</strong> has joined.`);
    }

    renderPresence(currentOtherPlayers);
  },

  playerDisconnected: (name: string) => {
    displayChatMessage(`<strong>${name}</strong> has left.`);
    currentOtherPlayers = currentOtherPlayers.filter((p) => p !== name);
    renderPresence(currentOtherPlayers);
  },

  playerEntered: (name: string, from: string) => {
    console.log("In playerJoined", name);
    if (currentOtherPlayers.indexOf(name) === -1) {
      currentOtherPlayers.push(name);
      displayChatMessage(`<strong>${name}</strong> walks in from ${from}.`);
    }

    renderPresence(currentOtherPlayers);
  },

  playerLeft: (name: string, to: string) => {
    displayChatMessage(`<strong>${name}</strong> wanders to ${to}.`);
    currentOtherPlayers = currentOtherPlayers.filter((p) => p !== name);
    renderPresence(currentOtherPlayers);
  },

  chatMessageReceived: (name: string, message: string) => {
    displayChatMessage(message, name);
  },

  statusMessageReceived: (message: string) => {
    displayChatMessage(message);
  },
};

const sendMessage = () => {
  const input: HTMLInputElement = document.querySelector("#chat-input");
  const text = input.value;

  if (text === "" || text === undefined) return;

  sendChatMessage(text);

  if (!/^\/(.+?) (.+)/.exec(text)) {
    delegate.chatMessageReceived(localStorage.getItem("name"), text);
  }

  input.value = "";
};

const displayChatMessage = (msg: string, name?: string) => {
  const el = document.createElement("div");

  if (name) {
    el.innerHTML = `<strong>${name}:</strong> ${msg}`;
  } else {
    el.innerHTML = msg;
  }

  document.getElementById("messages").append(el);
  el.scrollIntoView();
};

window.addEventListener("DOMContentLoaded", () => {
  let name = localStorage.getItem("name");
  if (!name) {
    name = prompt("What is your user ID?");
    localStorage.setItem("name", name);
  }
  connect(name, delegate);

  document.getElementById("send").addEventListener("click", sendMessage);
  document.addEventListener("keypress", (e) => {
    if (e.code === "Enter") {
      sendMessage();
    }
  });
});
