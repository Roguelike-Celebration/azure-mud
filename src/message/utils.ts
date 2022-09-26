import { v4 as uuid } from 'uuid'

import { MessageType } from './enums'
import {
  BaseMessage,
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

/**
 * type predicates (e.g. "is message x one of type y")
 */

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

/**
 * message creators
 */

// intentionally not exported, more of an "internal consistency" utility
const createBaseMessage = <T extends MessageType>(type: T): BaseMessage<T> => ({
  type,
  id: uuid(),
  timestamp: new Date().toISOString()
})

export const createConnectedMessage = (
  userId: string,
  roomId: string,
  numUsersInRoom: number
): ConnectedMessage => ({
  ...createBaseMessage(MessageType.Connected),
  userId,
  roomId,
  numUsersInRoom
})

export const createDisconnectedMessage = (
  userId: string,
  roomId: string,
  numUsersInRoom: number
): DisconnectedMessage => ({
  ...createBaseMessage(MessageType.Disconnected),
  userId,
  roomId,
  numUsersInRoom
})

export const createEnteredMessage = (
  userId: string,
  fromId: string,
  fromName: string,
  roomId: string,
  numUsersInRoom: number
): EnteredMessage => ({
  ...createBaseMessage(MessageType.Entered),
  userId,
  fromId,
  fromName,
  roomId,
  numUsersInRoom
})

export const createLeftMessage = (
  userId: string,
  toId: string,
  toName: string,
  roomId: string,
  numUsersInRoom: number
): LeftMessage => ({
  ...createBaseMessage(MessageType.Left),
  userId,
  toId,
  toName,
  roomId,
  numUsersInRoom
})

export const createMovedRoomMessage = (to: string): MovedRoomMessage => ({
  ...createBaseMessage(MessageType.MovedRoom),
  to
})

export const createSameRoomMessage = (to: string): SameRoomMessage => ({
  ...createBaseMessage(MessageType.SameRoom),
  roomId: to
})

export const createChatMessage = (
  messageId: string,
  userId: string,
  message: string
): ChatMessage => ({
  ...createBaseMessage(MessageType.Chat),
  messageId,
  userId,
  message
})

export const createCaptionMessage = (
  messageId: string,
  userId: string,
  message: string
): CaptionMessage => ({
  ...createBaseMessage(MessageType.Caption),
  messageId,
  userId,
  message
})

export const createWhisperMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): WhisperMessage => ({
  ...createBaseMessage(MessageType.Whisper),
  userId,
  message,
  senderIsSelf
})

export const createModMessage = (
  userId: string,
  message: string,
  senderIsSelf = false
): ModMessage => ({
  ...createBaseMessage(MessageType.Mod),
  userId,
  message,
  senderIsSelf
})

export const createShoutMessage = (
  id: string,
  userId: string,
  message: string
): ShoutMessage => ({
  ...createBaseMessage(MessageType.Shout),
  messageId: id,
  userId,
  message
})

export const createEmoteMessage = (
  id: string,
  userId: string,
  message: string
): EmoteMessage => ({
  ...createBaseMessage(MessageType.Emote),
  messageId: id,
  userId,
  message
})

export const createDanceMessage = (
  id: string,
  userId: string,
  message: string
): DanceMessage => ({
  ...createBaseMessage(MessageType.Dance),
  messageId: id,
  userId,
  message
})

export const createErrorMessage = (error: string): ErrorMessage => ({
  ...createBaseMessage(MessageType.Error),
  error
})

export const createCommandMessage = (command: string): CommandMessage => ({
  ...createBaseMessage(MessageType.Command),
  command
})
