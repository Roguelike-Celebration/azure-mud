// TODO: This conversion shouldn't be necessary
// But I don't understand how we're using/populating `notes`.
// There should be a clean refactor here
// (although this file will probably still exist to be the single point of importing
// the Server room and just exporting a 'clean' definition)

import * as Server from '../server/src/rooms'
import { RoomNote } from '../server/src/roomNote'
export interface Room {
  displayName: string;
  shortName: string;
  id: string;
  description: string;
  users?: string[];
  videoUsers?: string[];
  noMediaChat: boolean;
  hidden?: boolean;
  hasNoteWall: boolean;
  noteWallData: Server.NoteWallData
  notes?: RoomNote[]
  specialFeatures?: string[]
  riddles?: string[]
}

export function convertServerRoom (room: Server.Room): Room {
  return {
    displayName: room.displayName,
    id: room.id,
    shortName: room.shortName,
    description: room.description,
    noMediaChat: room.noMediaChat,
    hasNoteWall: room.hasNoteWall,
    noteWallData: room.noteWallData,
    hidden: room.hidden,
    specialFeatures: room.specialFeatures,
    riddles: room.riddles
  }
}

export function convertServerRoomData (roomData: {
  [roomId: string]: Server.Room;
}): { [roomId: string]: Room } {
  const newObj = {}

  Object.keys(roomData).forEach((k) => {
    const room = roomData[k]
    newObj[k] = convertServerRoom(room)
  })

  return newObj
}
