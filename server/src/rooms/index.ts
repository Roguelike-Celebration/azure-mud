import DB from '../redis'
import type { MinimalRoomDataMap, RoomDataMap } from '../types'

import json from './data/roomData.json'

export const staticRoomData: RoomDataMap = json

export interface Room {
  /** String room id, e.g. "kitchen" */
  id: string
  /** Long display name, e.g. "GitHub HQ: Kitchen" */
  displayName: string
  /** Short display name, e.g. "the kitchen" */
  shortName: string
  description: string

  /** If true, webRTC audio/video chat is enabled */
  mediaChat?: boolean

  // As we add more pieces of one-off functionality,
  // having a bunch of ad-hoc flags like this will probably get frustrating quickly.
  // We may want to eventually refactor to something resembling an ECS.
  /** Whether the room should let users place post-it notes */
  hasNoteWall?: boolean
  noteWallData?: NoteWallData

  /** If true, don't show the room in the side list (except to mods) */
  hidden?: boolean

  // TODO: Put this in JSON schema
  // 'RAINBOW_DOOR'|'DULL_DOOR'|'FULL_ROOM_INDEX'|'VENDING_MACHINE'
  specialFeatures?: string[]

  // This should hopefully eventually be auto-generated and mandatory
  // but hand-coding for testing purposes now
  /** GUID for a corresponding ACS videochat room */
  chatGuid?: string

  riddles?: string[]

  /** Ids of users currently in this room */
  users?: string[]

  /** Text for a modal accessed by clicking a special link in the room description */
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

export async function minimalRoomData (): Promise<MinimalRoomDataMap> {
  const roomIds = await DB.getRoomIds()
  const roomData: MinimalRoomDataMap = {};
  (await Promise.all(roomIds.map(DB.getRoomData)))
    .map(minimizeRoom)
    .forEach((r) => {
      roomData[r.id] = r
    })

  return roomData
}
