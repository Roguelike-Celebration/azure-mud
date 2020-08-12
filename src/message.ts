export type Message =
  | ConnectedMessage
  | DisconnectedMessage
  | EnteredMessage
  | LeftMessage
  | MovedRoomMessage
  | ChatMessage
  | WhisperMessage
  | ShoutMessage
  | EmoteMessage
  | ModMessage
  | ErrorMessage;

export enum MessageType {
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
  Entered = 'ENTERED',
  Left = 'LEFT',
  MovedRoom = 'MOVED',
  Chat = 'CHAT',
  Whisper = 'WHISPER',
  Shout = 'SHOUT',
  Emote = 'EMOTE',
  Mod = 'MOD',
  Error = 'ERROR',
}

export interface ConnectedMessage {
  type: MessageType.Connected;
  userId: string;
}

export const createConnectedMessage = (userId: string): ConnectedMessage => {
  return { type: MessageType.Connected, userId }
}

export interface DisconnectedMessage {
  type: MessageType.Disconnected;
  userId: string;
}

export const createDisconnectedMessage = (
  userId: string
): DisconnectedMessage => {
  return { type: MessageType.Disconnected, userId }
}

export interface EnteredMessage {
  type: MessageType.Entered;
  userId: string;
  from: string;
}

export const createEnteredMessage = (
  userId: string,
  from: string
): EnteredMessage => {
  return { type: MessageType.Entered, userId, from }
}

export interface LeftMessage {
  type: MessageType.Left;
  userId: string;
  to: string;
}

export const createLeftMessage = (userId: string, to: string): LeftMessage => {
  return { type: MessageType.Left, userId, to }
}

export interface MovedRoomMessage {
  type: MessageType.MovedRoom;
  to: string;
}

export const createMovedRoomMessage = (to: string): MovedRoomMessage => {
  return { type: MessageType.MovedRoom, to }
}

export interface ChatMessage {
  type: MessageType.Chat;
  userId: string;
  message: string;
}

export const createChatMessage = (
  userId: string,
  message: string
): ChatMessage => {
  return { type: MessageType.Chat, userId, message }
}

export interface WhisperMessage {
  type: MessageType.Whisper;
  userId: string;
  message: string;
  senderIsSelf: boolean;
}

export const createWhisperMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): WhisperMessage => {
  return { type: MessageType.Whisper, userId, message, senderIsSelf }
}

export interface ModMessage {
  type: MessageType.Mod;
  userId: string;
  message: string;
  senderIsSelf: boolean;
}

export const createModMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): ModMessage => {
  return { type: MessageType.Mod, userId, message, senderIsSelf }
}

export interface ShoutMessage {
  type: MessageType.Shout;
  userId: string;
  message: string;
}

export const createShoutMessage = (
  userId: string,
  message: string
): ShoutMessage => {
  return { type: MessageType.Shout, userId, message }
}

export interface EmoteMessage {
  type: MessageType.Emote;
  userId: string;
  message: string;
}

export const createEmoteMessage = (
  userId: string,
  message: string
): EmoteMessage => {
  return { type: MessageType.Emote, userId, message }
}

export interface ErrorMessage {
  type: MessageType.Error;
  error: string;
}

export const createErrorMessage = (error: string): ErrorMessage => {
  return { type: MessageType.Error, error }
}
