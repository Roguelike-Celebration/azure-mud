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
  | CaptionMessage

export interface ConnectedMessage {
  type: MessageType.Connected;
  userId: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export interface DisconnectedMessage {
  type: MessageType.Disconnected;
  userId: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export interface EnteredMessage {
  type: MessageType.Entered;
  userId: string;
  fromId: string;
  fromName: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export interface LeftMessage {
  type: MessageType.Left;
  userId: string;
  toId: string;
  toName: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export interface MovedRoomMessage {
  type: MessageType.MovedRoom;
  to: string;
  timestamp: Date;
}

export interface SameRoomMessage {
  type: MessageType.SameRoom;
  roomId: string;
  timestamp: Date;
}

export interface ChatMessage {
  type: MessageType.Chat;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export interface CaptionMessage {
  type: MessageType.Caption;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export interface WhisperMessage {
  type: MessageType.Whisper;
  userId: string;
  message: string;
  senderIsSelf: boolean;
  timestamp: Date;
}

export interface ModMessage {
  type: MessageType.Mod;
  userId: string;
  message: string;
  senderIsSelf: boolean;
  timestamp: Date;
}

export interface ShoutMessage {
  type: MessageType.Shout;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export interface EmoteMessage {
  type: MessageType.Emote;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export interface DanceMessage {
  type: MessageType.Dance;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export interface ErrorMessage {
  type: MessageType.Error;
  error: string;
  timestamp: Date;
}

export interface CommandMessage {
  type: MessageType.Command;
  command: string;
  timestamp: Date;
}
