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

interface ConnectedMessage {
  type: MessageType.Connected;
  name: string;
}

export const ConnectedMessage = (name: string): ConnectedMessage => {
  return { type: MessageType.Connected, name };
};

interface DisconnectedMessage {
  type: MessageType.Disconnected;
  name: string;
}

export const DisconnectedMessage = (name: string): DisconnectedMessage => {
  return { type: MessageType.Disconnected, name };
};

interface EnteredMessage {
  type: MessageType.Entered;
  name: string;
  from: string;
}

export const EnteredMessage = (name: string, from: string): EnteredMessage => {
  return { type: MessageType.Entered, name, from };
};

interface LeftMessage {
  type: MessageType.Left;
  name: string;
  to: string;
}

export const LeftMessage = (name: string, to: string): LeftMessage => {
  return { type: MessageType.Left, name, to };
};

interface ChatMessage {
  type: MessageType.Chat;
  name: string;
  message: string;
}

export const ChatMessage = (name: string, message: string): ChatMessage => {
  return { type: MessageType.Chat, name, message };
};

interface WhisperMessage {
  type: MessageType.Whisper;
  name: string;
  message: string;
}

export const WhisperMessage = (
  name: string,
  message: string
): WhisperMessage => {
  return { type: MessageType.Whisper, name, message };
};

interface ErrorMessage {
  type: MessageType.Error;
  error: string;
}

export const ErrorMessage = (error: string): ErrorMessage => {
  return { type: MessageType.Error, error };
};
