import { Room } from './room'
import { User, MinimalUser, PublicUser } from './user'
import { RoomNote } from './roomNote'

export interface ServerSettings {
  movementMessagesHideThreshold: number;
  movementMessagesHideRoomIds: string[];
}

export function toServerSettings(obj: any): ServerSettings | null {
  try {
    return {
      movementMessagesHideThreshold: obj.movementMessagesHideThreshold,
      movementMessagesHideRoomIds: obj.movementMessagesHideRoomIds
    }
  } catch (e) {
    return null
  }
}

export interface RoomResponse {
  roomId: string;
  presenceData?: { [roomId: string]: string[] };
  users?: { [userId: string]: MinimalUser };
  roomData?: { [roomId: string]: Room };
  profile?: PublicUser;
  roomNotes?: RoomNote[]
}

export interface ErrorResponse {
  error: string;
}

export interface ProfileResponse {
  user: User;
}
