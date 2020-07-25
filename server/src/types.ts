import { Room } from "./room";
import { User, MinimalUser } from "./user";

export interface RoomResponse {
  room: Room;
  roomOccupants: string[];
  users?: { [userId: string]: MinimalUser };
}

export interface ErrorResponse {
  error: string;
}

export interface ProfileResponse {
  user: User;
}
