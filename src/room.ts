import * as Server from "../server/src/room";
import { RoomResponse } from "../server/src/types";
export interface Room {
  name: string;
  description: string;
  users: string[];
  allowsMedia: boolean;
}

export function convertServerRoom(result: RoomResponse): Room {
  return {
    name: result.room.displayName,
    description: result.room.description,
    allowsMedia: result.room.allowsMedia,
    users: result.roomOccupants,
  };
}
