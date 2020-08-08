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
