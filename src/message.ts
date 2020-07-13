export type Message =
  | ConnectedMessage
  | DisconnectedMessage
  | EnteredMessage
  | LeftMessage
  | ChatMessage
  | WhisperMessage
  | ErrorMessage;

export enum MessageType {
  Connected = "CONNECTED",
  Disconnected = "DISCONNECTED",
  Entered = "ENTERED",
  Left = "LEFT",
  Chat = "CHAT",
  Whisper = "WHISPER",
  Error = "ERROR",
}

export interface ConnectedMessage {
  type: MessageType.Connected;
  name: string;
}

export interface DisconnectedMessage {
  type: MessageType.Disconnected;
  name: string;
}

export interface EnteredMessage {
  type: MessageType.Entered;
  name: string;
  from: string;
}

export interface LeftMessage {
  type: MessageType.Left;
  name: string;
  to: string;
}

export interface ChatMessage {
  type: MessageType.Chat;
  name: string;
  message: string;
}

export interface WhisperMessage {
  type: MessageType.Whisper;
  name: string;
  message: string;
}

export interface ErrorMessage {
  type: MessageType.Error;
  error: string;
}
