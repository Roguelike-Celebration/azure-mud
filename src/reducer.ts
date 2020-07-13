import { ActionType, Action } from "./Actions";
import { MessageType, Message } from "./message";
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
    state.messages.push({ type: MessageType.Connected, name: action.value });
  }

  if (action.type === ActionType.PlayerDisconnected) {
    state.room.users = state.room.users.filter((u) => u !== action.value);
    state.messages.push({ type: MessageType.Disconnected, name: action.value });
  }

  if (action.type === ActionType.PlayerEntered) {
    state.room.users.push(action.value.name);
    state.messages.push({ type: MessageType.Entered, ...action.value });
  }

  if (action.type === ActionType.PlayerLeft) {
    state.room.users = state.room.users.filter((u) => u !== action.value.name);
    state.messages.push({ type: MessageType.Left, ...action.value });
  }

  if (action.type === ActionType.ChatMessage) {
    state.messages.push({ type: MessageType.Chat, ...action.value });
  }

  if (action.type === ActionType.Whisper) {
    state.messages.push({ type: MessageType.Whisper, ...action.value });
  }

  if (action.type === ActionType.Error) {
    state.messages.push({ type: MessageType.Error, error: action.value });
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    sendChatMessage(action.value);

    const isCommand = /^\/(.+?) (.+)/.exec(action.value);
    if (isCommand) {
      if (isCommand[1] === "whisper") {
        const [_, to, message] = /^(.+?) (.+)/.exec(isCommand[2]);
        state.messages.push({
          type: MessageType.Whisper,
          name: to,
          message,
        });
      }
    } else {
      state.messages.push({
        type: MessageType.Chat,
        name: state.name,
        message: action.value,
      });
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
