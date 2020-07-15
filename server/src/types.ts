import { Room } from "./room";

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
