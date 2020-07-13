import { Action, ActionType } from "./Actions";
import {
  Message,
  ConnectedMessage,
  DisconnectedMessage,
  EnteredMessage,
  LeftMessage,
  ChatMessage,
  WhisperMessage,
  ErrorMessage,
} from "./message";
import { Room } from "./Room";
import { sendChatMessage } from "./networking";

export interface State {
  room?: Room;
  messages: Message[];
  name?: string;
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  console.log("In reducer", action);

  // TODO: This could hurt perf when we have a lot of messages
  let state: State = JSON.parse(JSON.stringify(oldState));

  if (action.type === ActionType.UpdatedRoom) {
    let { name, description } = action.value;

    description = parseDescription(description);

    // TODO: RoomView should have an onClick handler for these links

    state.room = {
      name,
      description,
      users: [],
    };
  }

  if (action.type === ActionType.UpdatedPresence) {
    state.room.users = action.value;
  }

  if (action.type === ActionType.PlayerConnected) {
    state.room.users.push(action.value);
    state.messages.push(ConnectedMessage(action.value));
  }

  if (action.type === ActionType.PlayerDisconnected) {
    state.room.users = state.room.users.filter((u) => u !== action.value);
    state.messages.push(DisconnectedMessage(action.value));
  }

  if (action.type === ActionType.PlayerEntered) {
    state.room.users.push(action.value.name);
    state.messages.push(EnteredMessage(action.value.name, action.value.from));
  }

  if (action.type === ActionType.PlayerLeft) {
    state.room.users = state.room.users.filter((u) => u !== action.value.name);
    state.messages.push(LeftMessage(action.value.name, action.value.to));
  }

  if (action.type === ActionType.ChatMessage) {
    state.messages.push(ChatMessage(action.value.name, action.value.message));
  }

  if (action.type === ActionType.Whisper) {
    state.messages.push(
      WhisperMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.Error) {
    state.messages.push(ErrorMessage(action.value));
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    sendChatMessage(action.value);

    const isCommand = /^\/(.+?) (.+)/.exec(action.value);
    if (isCommand) {
      if (isCommand[1] === "whisper") {
        const [_, to, message] = /^(.+?) (.+)/.exec(isCommand[2]);
        state.messages.push(WhisperMessage(to, message));
      }
    } else {
      state.messages.push(ChatMessage(state.name, action.value));
    }
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
