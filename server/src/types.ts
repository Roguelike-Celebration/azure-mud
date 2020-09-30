import { Room } from './rooms'
import { User, MinimalUser, PublicUser } from './user'
import { RoomNote } from './roomNote'

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

export enum ValidColors {
  Blue = 'Blue',
  Cyan = 'Cyan',
  Green = 'Green',
  Magenta = 'Magenta',
  Orange = 'Orange',
  Red = 'Red',
  Violet = 'Violet',
  Yellow = 'Yellow'
}
