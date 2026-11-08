import { MessageType } from './enums.js'

/** A message, as a union type of all our particular message types. */
export type Message =
  | ConnectedMessage
  | DisconnectedMessage
  | EnteredMessage
  | LeftMessage
  | MovedRoomMessage
  | SameRoomMessage
  | ChatMessage
  | WhisperMessage
  | ShoutMessage
  | EmoteMessage
  | DanceMessage
  | ModMessage
  | ErrorMessage
  | CommandMessage

/** Member of Message union type whose `type` is T. */
export type MessageOfType<T extends MessageType> = Extract<Message, { type: T }>

export interface BaseMessage<T extends MessageType> {
  type: T;
  id: string;
  /**
   * should be an ISO string `YYYY-MM-DDTHH:mm:ss.sssZ`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  timestamp: string;
}

// Must be kept in sync with deletableMessageTypes/isDeletableMessage in message/utils.ts.
export interface DeletableMessage<T extends MessageType> extends BaseMessage<T> {
  // Optional because field was added 2026-11 and old cached messages lack it.
  deleted?: boolean;
}

export interface ConnectedMessage extends BaseMessage<MessageType.Connected> {
  userId: string;
  roomId: string;
  numUsersInRoom: number;
}

export interface DisconnectedMessage
  extends BaseMessage<MessageType.Disconnected> {
  userId: string;
  roomId: string;
  numUsersInRoom: number;
}

export interface EnteredMessage extends BaseMessage<MessageType.Entered> {
  userId: string;
  fromId: string;
  fromName: string;
  roomId: string;
  numUsersInRoom: number;
}

export interface LeftMessage extends BaseMessage<MessageType.Left> {
  userId: string;
  toId: string;
  toName: string;
  roomId: string;
  numUsersInRoom: number;
}

export interface MovedRoomMessage extends BaseMessage<MessageType.MovedRoom> {
  to: string;
  // Optional because field was added 2026-11 and old cached messages lack it
  spawned?: boolean;
}

export interface SameRoomMessage extends BaseMessage<MessageType.SameRoom> {
  roomId: string;
}

export interface ChatMessage extends DeletableMessage<MessageType.Chat> {
  userId: string;
  message: string;
}

export interface WhisperMessage extends BaseMessage<MessageType.Whisper> {
  userId: string;
  message: string;
  senderIsSelf: boolean;
}

export interface ModMessage extends BaseMessage<MessageType.Mod> {
  userId: string;
  message: string;
  senderIsSelf: boolean;
}

export interface ShoutMessage extends DeletableMessage<MessageType.Shout> {
  userId: string;
  message: string;
}

export interface EmoteMessage extends DeletableMessage<MessageType.Emote> {
  userId: string;
  message: string;
}

export interface DanceMessage extends DeletableMessage<MessageType.Dance> {
  userId: string;
  message: string;
}

export interface ErrorMessage extends BaseMessage<MessageType.Error> {
  error: string;
}

export interface CommandMessage extends BaseMessage<MessageType.Command> {
  command: string;
}
