import { MessageType } from './enums'

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
  | CaptionMessage;

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
}

export interface SameRoomMessage extends BaseMessage<MessageType.SameRoom> {
  roomId: string;
}

export interface ChatMessage extends BaseMessage<MessageType.Chat> {
  userId: string;
  message: string;
}

export interface CaptionMessage extends BaseMessage<MessageType.Caption> {
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

export interface ShoutMessage extends BaseMessage<MessageType.Shout> {
  userId: string;
  message: string;
}

export interface EmoteMessage extends BaseMessage<MessageType.Emote> {
  userId: string;
  message: string;
}

export interface DanceMessage extends BaseMessage<MessageType.Dance> {
  userId: string;
  message: string;
}

export interface ErrorMessage extends BaseMessage<MessageType.Error> {
  error: string;
}

export interface CommandMessage extends BaseMessage<MessageType.Command> {
  command: string;
}
