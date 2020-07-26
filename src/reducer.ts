import { Action, ActionType } from "./Actions";
import {
  Message,
  createConnectedMessage,
  createDisconnectedMessage,
  createEnteredMessage,
  createLeftMessage,
  createChatMessage,
  createWhisperMessage,
  createErrorMessage,
  createShoutMessage,
  createModMessage,
} from "./message";
import { Room } from "./Room";
import { sendChatMessage, toggleUserBan } from "./networking";
import { PublicUser, MinimalUser } from "../server/src/user";

export interface State {
  authenticated: boolean;
  checkedAuthentication: boolean;
  inMediaChat: boolean;

  hasRegistered: boolean;

  room?: Room;
  messages: Message[];
  userId?: string;
  userMap: { [userId: string]: MinimalUser };

  prepopulatedInput?: string;

  hasLocalMediaStream: boolean;
  otherMediaStreamPeerIds?: string[];

  // User ID of whose profile should be shwon
  visibleProfile?: PublicUser;
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  console.log("In reducer", action);

  // TODO: This could hurt perf when we have a lot of messages
  let state: State = JSON.parse(JSON.stringify(oldState));
  state.prepopulatedInput = undefined;

  if (action.type === ActionType.UpdatedRoom) {
    let { name, description, allowsMedia } = action.value;

    description = parseDescription(description);

    state.room = {
      name,
      description,
      users: [],
      allowsMedia,
    };
  }

  if (action.type === ActionType.UpdatedPresence) {
    state.room.users = action.value.filter((u) => u !== state.userId);
  }

  if (action.type === ActionType.PlayerConnected) {
    const user = action.value;
    if (!state.room.users.includes(user.id)) {
      state.room.users.push(user.id);
      state.messages.push(createConnectedMessage(user.id));
    }
    state.userMap[user.id] = user;
  }

  if (action.type === ActionType.PlayerDisconnected) {
    state.room.users = state.room.users.filter((u) => u !== action.value);
    state.messages.push(createDisconnectedMessage(action.value));
  }

  if (action.type === ActionType.PlayerEntered) {
    if (!state.room.users.includes(action.value.name)) {
      state.room.users.push(action.value.name);
      state.messages.push(
        createEnteredMessage(action.value.name, action.value.from)
      );
    }
  }

  if (action.type === ActionType.PlayerLeft) {
    state.room.users = state.room.users.filter((u) => u !== action.value.name);
    state.messages.push(createLeftMessage(action.value.name, action.value.to));
  }

  if (action.type === ActionType.ChatMessage) {
    state.messages.push(
      createChatMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.Whisper) {
    state.messages.push(
      createWhisperMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.ModMessage) {
    state.messages.push(
      createModMessage(
        action.value.name,
        action.value.message,
        action.value.name === state.userId
      )
    );
  }

  if (action.type === ActionType.Shout) {
    state.messages.push(
      createShoutMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.UserMap) {
    state.userMap = { ...state.userMap, ...action.value };
  }

  if (action.type === ActionType.Error) {
    state.messages.push(createErrorMessage(action.value));
  }

  // WebRTC
  if (action.type === ActionType.LocalMediaStreamOpened) {
    state.hasLocalMediaStream = true;
  }

  if (action.type === ActionType.P2PStreamReceived) {
    if (!state.otherMediaStreamPeerIds.includes(action.value)) {
      state.otherMediaStreamPeerIds.push(action.value);
    }
  }

  if (action.type === ActionType.P2PDataReceived) {
    console.log("Received P2P data!", action.value.peerId, action.value.data);
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    sendChatMessage(action.value);

    const isCommand = /^\/(.+?) (.+)/.exec(action.value);
    if (isCommand) {
      if (isCommand[1] === "whisper") {
        const [_, username, message] = /^(.+?) (.+)/.exec(isCommand[2]);
        const user = Object.values(state.userMap).find(
          (u) => u.username === username
        );
        const userId = user && user.id;
        if (userId) {
          state.messages.push(createWhisperMessage(userId, message, true));
        }
      }
    } else {
      state.messages.push(createChatMessage(state.userId, action.value));
    }
  }

  if (action.type === ActionType.StartWhisper) {
    state.prepopulatedInput = `/whisper ${action.value} `;
  }

  if (action.type === ActionType.ShowProfile) {
    state.visibleProfile = action.value;
  }
  if (action.type === ActionType.Authenticate) {
    state.checkedAuthentication = true;

    if (action.value.userId && action.value.name) {
      state.authenticated = true;
      state.userId = action.value.userId;

      // If you haven't registered yet, we need to grab your username before we've pulled a server userMap
      state.userMap[action.value.userId] = {
        id: action.value.userId,
        username: action.value.name,
      };
    }
  }

  if (action.type === ActionType.IsRegistered) {
    state.hasRegistered = true;
  }

  if (action.type === ActionType.BanToggle) {
    toggleUserBan(action.value);
  }

  return state;
};

function parseDescription(description: string): string {
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g;
  const simpleLinkRegex = /\[\[(.+?)\]\]/g;

  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    return `<a class='room-link' href='#' data-room='${roomId}'>${text}</a>`;
  });

  description = description.replace(simpleLinkRegex, (match, roomId) => {
    return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}</a>`;
  });
  return description;
}
