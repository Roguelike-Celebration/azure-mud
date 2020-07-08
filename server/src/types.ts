import { Room } from "./room";

export interface RoomResponse {
  room: Room;
  roomOccupants: string[];
}
