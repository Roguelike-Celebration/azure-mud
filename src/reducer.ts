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
} from "./message";
import { Room } from "./Room";
import { sendChatMessage } from "./networking";
import { PublicUser } from "../server/src/user";

export interface State {
  authenticated: boolean;

  room?: Room;
  messages: Message[];
  name?: string;
  prepopulatedInput?: string;

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
    let { name, description } = action.value;

    description = parseDescription(description);

    state.room = {
      name,
      description,
      users: [],
    };
  }

  if (action.type === ActionType.UpdatedPresence) {
    state.room.users = action.value.filter((u) => u !== state.name);
  }

  if (action.type === ActionType.PlayerConnected) {
    if (!state.room.users.includes(action.value)) {
      state.room.users.push(action.value);
      state.messages.push(createConnectedMessage(action.value));
    }
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

  if (action.type === ActionType.Shout) {
    state.messages.push(
      createShoutMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.Error) {
    state.messages.push(createErrorMessage(action.value));
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    sendChatMessage(action.value);

    const isCommand = /^\/(.+?) (.+)/.exec(action.value);
    if (isCommand) {
      if (isCommand[1] === "whisper") {
        const [_, to, message] = /^(.+?) (.+)/.exec(isCommand[2]);
        state.messages.push(createWhisperMessage(to, message, true));
      }
    } else {
      state.messages.push(createChatMessage(state.name, action.value));
    }
  }

  if (action.type === ActionType.StartWhisper) {
    console.log("Preopopulating");
    state.prepopulatedInput = `/whisper ${action.value} `;
  }

  if (action.type === ActionType.ShowProfile) {
    state.visibleProfile = action.value;
  }

  if (action.type === ActionType.Authenticate) {
    state.authenticated = true;
    state.name = action.value;
  }

  return state;
};

function parseDescription(description: string): string {
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g;
  const simpleLinkRegex = /\[\[(.+?)\]\]/g;

  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    console.log("Replacing complex", match, text, roomId);
    return `<a class='room-link' href='#' data-room='${roomId}'>${text}</a>`;
  });

  description = description.replace(simpleLinkRegex, (match, roomId) => {
    console.log("Replacing simple", match, roomId);
    return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}</a>`;
  });
  return description;
}
