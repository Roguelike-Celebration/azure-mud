import { Room } from "./room";
import { User, MinimalUser } from "./user";

export interface RoomResponse {
  roomId: string;
  presenceData: { [roomId: string]: string[] };
  users?: { [userId: string]: MinimalUser };
  roomData?: { [roomId: string]: Room };
}

export interface ErrorResponse {
  error: string;
}

export interface ProfileResponse {
  user: User;
}
