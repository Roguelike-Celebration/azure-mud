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

export const createConnectedMessage = (name: string): ConnectedMessage => {
  return { type: MessageType.Connected, name };
};

export interface DisconnectedMessage {
  type: MessageType.Disconnected;
  name: string;
}

export const createDisconnectedMessage = (
  name: string
): DisconnectedMessage => {
  return { type: MessageType.Disconnected, name };
};

export interface EnteredMessage {
  type: MessageType.Entered;
  name: string;
  from: string;
}

export const createEnteredMessage = (
  name: string,
  from: string
): EnteredMessage => {
  return { type: MessageType.Entered, name, from };
};

export interface LeftMessage {
  type: MessageType.Left;
  name: string;
  to: string;
}

export const createLeftMessage = (name: string, to: string): LeftMessage => {
  return { type: MessageType.Left, name, to };
};

export interface ChatMessage {
  type: MessageType.Chat;
  name: string;
  message: string;
}

export const createChatMessage = (
  name: string,
  message: string
): ChatMessage => {
  return { type: MessageType.Chat, name, message };
};

export interface WhisperMessage {
  type: MessageType.Whisper;
  name: string;
  message: string;
}

export const createWhisperMessage = (
  name: string,
  message: string
): WhisperMessage => {
  return { type: MessageType.Whisper, name, message };
};

export interface ErrorMessage {
  type: MessageType.Error;
  error: string;
}

export const createErrorMessage = (error: string): ErrorMessage => {
  return { type: MessageType.Error, error };
};
