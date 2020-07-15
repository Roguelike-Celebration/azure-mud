import { Room } from "./room";
import { User } from "./user";

export interface RoomResponse {
  room: Room;
  roomOccupants: string[];
}

export interface ErrorResponse {
  error: string;
}

export interface ProfileResponse {
  user: User;
}
