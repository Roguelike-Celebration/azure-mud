import json from './data/roomData.json'
import DB from '../redis'

export const staticRoomData: {[name: string]: Room} = json

export interface Room {
  // e.g. "kitchen"
  id: string

  // e.g. "GitHub HQ: Kitchen"
  displayName: string

  // e.g. "the kitchen"
  shortName: string

  description: string

  // If true, video chat is enabled
  // This currently does nothing, but leaving in place for hypothetical Zoom integration
  mediaChat?: boolean

  // Indicates whether the room should let users place post-it notes
  // As we add more pieces of one-off functionality,
  // having a bunch of ad-hoc flags like this will probably get frustrating quickly.
  // We may want to eventually refactor to something resembling an ECS.
  hasNoteWall?: boolean
  noteWallData?: NoteWallData

  // If true, don't show the room in the side list
  hidden?: boolean

  // TODO: Put this in JSON schema
  specialFeatures?: string[]
  // 'RAINBOW_DOOR'|'DULL_DOOR'|'FULL_ROOM_INDEX'|'VENDING_MACHINE'

  riddles?: string[]

  // Array of users currently in this room
  users?: string[]

  // text for a modal accessed by clicking a special link in the room description
  specialFeatureText?: string
}

export interface NoteWallData {
  roomWallDescription: string
  noteWallButton: string
  addNoteLinkText: string
  addNotePrompt: string
  noteWallDescription: string
}

export interface MinimalRoom {
  id: string;
  displayName: string;
  shortName: string;
  hidden: boolean;
 }

function minimizeRoom (room: Room): MinimalRoom {
  return {
    id: room.id,
    displayName: room.displayName,
    shortName: room.shortName,
    hidden: room.hidden
  }
}

export async function minimalRoomData (): Promise<{[roomId: string]: MinimalRoom}> {
  const roomIds = await DB.getRoomIds()
  const roomData = {};
  (await Promise.all(roomIds.map(DB.getRoomData)))
    .map(minimizeRoom)
    .forEach((r) => {
      roomData[r.id] = r
    })

  return roomData
}
