// TODO: This conversion shouldn't be necessary
// But I don't understand how we're using/populating `notes`.
// There should be a clean refactor here
// (although this file will probably still exist to be the single point of importing
// the Server room and just exporting a 'clean' definition)

import { RoomNote } from '../server/src/roomNote'
import * as Server from '../server/src/rooms'

import type { RoomDataMap } from './reducer'

export interface Room {
  displayName: string;
  shortName: string;
  id: string;
  description: string;
  users?: string[];
  videoUsers?: string[];
  mediaChat?: boolean;
  hidden?: boolean;
  hasNoteWall?: boolean;
  noteWallData?: Server.NoteWallData
  notes?: RoomNote[]
  specialFeatures?: string[]
  riddles?: string[]
  specialFeatureText?: string
}

export interface MinimalRoom {
  displayName: string;
  id: string;
}

export type ServerRoomDataMap = { [roomId: string]: Server.Room }

export function convertServerRoom (room: Server.Room): Room {
  return {
    displayName: room.displayName,
    id: room.id,
    shortName: room.shortName,
    description: room.description,
    mediaChat: room.mediaChat,
    hasNoteWall: room.hasNoteWall,
    noteWallData: room.noteWallData,
    hidden: room.hidden,
    specialFeatures: room.specialFeatures,
    riddles: room.riddles,
    users: room.users,
    specialFeatureText: room.specialFeatureText
  }
}

export function convertServerRoomData (roomData: ServerRoomDataMap): RoomDataMap {
  const newObj: RoomDataMap = {}

  Object.keys(roomData).forEach((k) => {
    const room = roomData[k]
    newObj[k] = convertServerRoom(room)
  })

  return newObj
}
