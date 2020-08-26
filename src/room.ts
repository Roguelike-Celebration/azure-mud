import * as Server from '../server/src/room'
import { RoomNote } from '../server/src/roomNote'
export interface Room {
  name: string;
  shortName: string;
  id: string;
  description: string;
  users?: string[];
  videoUsers?: string[];
  allowsMedia: boolean;
  hidden?: boolean;
  hasNoteWall: boolean;
  notes?: RoomNote[]
}

export function convertServerRoomData (roomData: {
  [roomId: string]: Server.Room;
}): { [roomId: string]: Room } {
  const newObj = {}

  Object.keys(roomData).forEach((k) => {
    const room = roomData[k]
    newObj[k] = {
      name: room.displayName,
      id: room.id,
      shortName: room.shortName,
      description: room.description,
      allowsMedia: room.allowsMedia,
      hasNoteWall: room.hasNoteWall,
      hidden: room.hidden
    }
  })

  return newObj
}
