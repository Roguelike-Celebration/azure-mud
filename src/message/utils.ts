import { MessageType } from './enums'
import {
  CaptionMessage,
  ChatMessage,
  CommandMessage,
  ConnectedMessage,
  DanceMessage,
  DisconnectedMessage,
  EmoteMessage,
  EnteredMessage,
  ErrorMessage,
  LeftMessage,
  Message,
  ModMessage,
  MovedRoomMessage,
  SameRoomMessage,
  ShoutMessage,
  WhisperMessage
} from './types'

type AnyDeletableMessage =
  | ChatMessage
  | EmoteMessage
  | ShoutMessage
  | DanceMessage;

const deletableMessageTypes = [
  MessageType.Chat,
  MessageType.Emote,
  MessageType.Shout,
  MessageType.Dance,
  MessageType.Caption
]

export const isDeletableMessage = (
  message: Message
): message is AnyDeletableMessage =>
  deletableMessageTypes.includes(message.type)

type AnyMovementMessage =
  | ConnectedMessage
  | DisconnectedMessage
  | EnteredMessage
  | LeftMessage;

const movementMessageTypes = [
  MessageType.Connected,
  MessageType.Disconnected,
  MessageType.Entered,
  MessageType.Left
]

export const isMovementMessage = (
  message: Message
): message is AnyMovementMessage => movementMessageTypes.includes(message.type)

export const createConnectedMessage = (
  userId: string,
  roomId: string,
  numUsersInRoom: number
): ConnectedMessage => {
  return {
    type: MessageType.Connected,
    userId,
    roomId,
    numUsersInRoom,
    timestamp: new Date()
  }
}

export const createDisconnectedMessage = (
  userId: string,
  roomId: string,
  numUsersInRoom: number
): DisconnectedMessage => {
  return {
    type: MessageType.Disconnected,
    userId,
    roomId,
    numUsersInRoom,
    timestamp: new Date()
  }
}

export const createEnteredMessage = (
  userId: string,
  fromId: string,
  fromName: string,
  roomId: string,
  numUsersInRoom: number
): EnteredMessage => {
  return {
    type: MessageType.Entered,
    userId,
    fromId,
    fromName,
    roomId,
    numUsersInRoom,
    timestamp: new Date()
  }
}

export const createLeftMessage = (
  userId: string,
  toId: string,
  toName: string,
  roomId: string,
  numUsersInRoom: number
): LeftMessage => {
  return {
    type: MessageType.Left,
    userId,
    toId,
    toName,
    roomId,
    numUsersInRoom,
    timestamp: new Date()
  }
}

export const createMovedRoomMessage = (to: string): MovedRoomMessage => {
  return { type: MessageType.MovedRoom, to, timestamp: new Date() }
}

export const createSameRoomMessage = (to: string): SameRoomMessage => {
  return { type: MessageType.SameRoom, roomId: to, timestamp: new Date() }
}

export const createChatMessage = (
  messageId: string,
  userId: string,
  message: string
): ChatMessage => {
  return {
    type: MessageType.Chat,
    messageId,
    userId,
    message,
    timestamp: new Date()
  }
}

export const createCaptionMessage = (
  messageId: string,
  userId: string,
  message: string
): CaptionMessage => {
  return {
    type: MessageType.Caption,
    messageId,
    userId,
    message,
    timestamp: new Date()
  }
}

export const createWhisperMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): WhisperMessage => {
  return {
    type: MessageType.Whisper,
    userId,
    message,
    senderIsSelf,
    timestamp: new Date()
  }
}

export const createModMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): ModMessage => {
  return {
    type: MessageType.Mod,
    userId,
    message,
    senderIsSelf,
    timestamp: new Date()
  }
}

export const createShoutMessage = (
  id: string,
  userId: string,
  message: string
): ShoutMessage => {
  return {
    type: MessageType.Shout,
    messageId: id,
    userId,
    message,
    timestamp: new Date()
  }
}

export const createEmoteMessage = (
  id: string,
  userId: string,
  message: string
): EmoteMessage => {
  return {
    type: MessageType.Emote,
    messageId: id,
    userId,
    message,
    timestamp: new Date()
  }
}

export const createDanceMessage = (
  id: string,
  userId: string,
  message: string
): DanceMessage => {
  return {
    type: MessageType.Dance,
    messageId: id,
    userId,
    message,
    timestamp: new Date()
  }
}

export const createErrorMessage = (error: string): ErrorMessage => {
  return { type: MessageType.Error, error, timestamp: new Date() }
}

export const createCommandMessage = (command: string): CommandMessage => {
  return { type: MessageType.Command, command, timestamp: new Date() }
}
