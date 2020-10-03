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
  | CommandMessage;

export enum MessageType {
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
  Entered = 'ENTERED',
  Left = 'LEFT',
  MovedRoom = 'MOVED',
  SameRoom = 'SAME',
  Chat = 'CHAT',
  Whisper = 'WHISPER',
  Shout = 'SHOUT',
  Emote = 'EMOTE',
  Dance = 'DANCE',
  Mod = 'MOD',
  Error = 'ERROR',
  Command = 'COMMAND',
}

export function isDeletable (message: Message): message is ChatMessage | EmoteMessage | ShoutMessage | DanceMessage {
  return [MessageType.Chat, MessageType.Emote, MessageType.Shout, MessageType.Dance].includes(message.type)
}

export interface ConnectedMessage {
  type: MessageType.Connected;
  userId: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export const createConnectedMessage = (userId: string, roomId: string, numUsersInRoom: number): ConnectedMessage => {
  return { type: MessageType.Connected, userId, roomId, numUsersInRoom, timestamp: new Date() }
}

export interface DisconnectedMessage {
  type: MessageType.Disconnected;
  userId: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export const createDisconnectedMessage = (
  userId: string,
  roomId: string,
  numUsersInRoom: number
): DisconnectedMessage => {
  return { type: MessageType.Disconnected, userId, roomId, numUsersInRoom, timestamp: new Date() }
}

export interface EnteredMessage {
  type: MessageType.Entered;
  userId: string;
  from: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export const createEnteredMessage = (
  userId: string,
  from: string,
  roomId: string,
  numUsersInRoom: number
): EnteredMessage => {
  return { type: MessageType.Entered, userId, from, roomId, numUsersInRoom, timestamp: new Date() }
}

export interface LeftMessage {
  type: MessageType.Left;
  userId: string;
  to: string;
  roomId: string;
  numUsersInRoom: number;
  timestamp: Date;
}

export const createLeftMessage = (userId: string, to: string, roomId: string, numUsersInRoom: number): LeftMessage => {
  return { type: MessageType.Left, userId, to, roomId, numUsersInRoom, timestamp: new Date() }
}

export interface MovedRoomMessage {
  type: MessageType.MovedRoom;
  to: string;
  timestamp: Date;
}

export const createMovedRoomMessage = (to: string): MovedRoomMessage => {
  return { type: MessageType.MovedRoom, to, timestamp: new Date() }
}

export interface SameRoomMessage {
  type: MessageType.SameRoom;
  room: string;
  timestamp: Date;
}

export const createSameRoomMessage = (to: string): SameRoomMessage => {
  return { type: MessageType.SameRoom, room: to, timestamp: new Date() }
}

export interface ChatMessage {
  type: MessageType.Chat;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export const createChatMessage = (
  messageId: string,
  userId: string,
  message: string
): ChatMessage => {
  return { type: MessageType.Chat, messageId, userId, message, timestamp: new Date() }
}

export interface WhisperMessage {
  type: MessageType.Whisper;
  userId: string;
  message: string;
  senderIsSelf: boolean;
  timestamp: Date;
}

export const createWhisperMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): WhisperMessage => {
  return { type: MessageType.Whisper, userId, message, senderIsSelf, timestamp: new Date() }
}

export interface ModMessage {
  type: MessageType.Mod;
  userId: string;
  message: string;
  senderIsSelf: boolean;
  timestamp: Date;
}

export const createModMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): ModMessage => {
  return { type: MessageType.Mod, userId, message, senderIsSelf, timestamp: new Date() }
}

export interface ShoutMessage {
  type: MessageType.Shout;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export const createShoutMessage = (
  id: string,
  userId: string,
  message: string
): ShoutMessage => {
  return { type: MessageType.Shout, messageId: id, userId, message, timestamp: new Date() }
}

export interface EmoteMessage {
  type: MessageType.Emote;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export const createEmoteMessage = (
  id: string,
  userId: string,
  message: string
): EmoteMessage => {
  return { type: MessageType.Emote, messageId: id, userId, message, timestamp: new Date() }
}

export interface DanceMessage {
  type: MessageType.Dance;
  messageId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export const createDanceMessage = (
  id: string,
  userId: string,
  message: string
): DanceMessage => {
  return { type: MessageType.Dance, messageId: id, userId, message, timestamp: new Date() }
}

export interface ErrorMessage {
  type: MessageType.Error;
  error: string;
  timestamp: Date;
}

export const createErrorMessage = (error: string): ErrorMessage => {
  return { type: MessageType.Error, error, timestamp: new Date() }
}

export interface CommandMessage {
  type: MessageType.Command;
  command: string;
  timestamp: Date;
}

export const createCommandMessage = (command: string): CommandMessage => {
  return { type: MessageType.Command, command, timestamp: new Date() }
}
