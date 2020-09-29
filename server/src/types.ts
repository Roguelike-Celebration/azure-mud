import { Room } from './room'
import { User, MinimalUser, PublicUser } from './user'
import { RoomNote } from './roomNote'

export interface ServerSettings {
  movementMessagesHideThreshold: number;
  movementMessagesHideRoomIds: string[];
}

// There's 100% a more elegant way to do this, but I think this works and want to actually get this feature finally done.
export function toServerSettings(obj: any): ServerSettings | null {
  try {
    if (obj.movementMessagesHideThreshold === undefined || obj.movementMessagesHideRoomIds === undefined) {
      return null
    } else {
      return {
        movementMessagesHideThreshold: obj.movementMessagesHideThreshold,
        movementMessagesHideRoomIds: obj.movementMessagesHideRoomIds
      }
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
