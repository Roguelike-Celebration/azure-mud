import { Room } from './room'
import { User, MinimalUser, PublicUser } from './user'

export interface RoomResponse {
  roomId: string;
  presenceData: { [roomId: string]: string[] };
  users?: { [userId: string]: MinimalUser };
  roomData?: { [roomId: string]: Room };
  profile?: PublicUser;
}

export interface ErrorResponse {
  error: string;
}

export interface ProfileResponse {
  user: User;
}

// TODO: Find a way to submit these upstream. Other people have this problem!
export interface SignalRMessage {
  userId?: string
  groupName?: string
  target: string
  arguments: any[]
}

export interface SignalRGroupAction {
  userId: string,
  groupName: string,
  action: 'add'|'remove'
}