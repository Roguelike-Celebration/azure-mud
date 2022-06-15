import json from './data/roomData.json'
export const staticRoomData: {[name: string]: Room} = json

export interface Room {
  // e.g. "kitchen"
  id: string

  // e.g. "GitHub HQ: Kitchen"
  displayName: string

  // e.g. "the kitchen"
  shortName: string

  description: string

  // If true, webRTC audio/video chat is enabled
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

  // The GUID for a corresponding ACS videochat room
  // This should hopefully eventually be auto-generated and mandatory
  // but hand-coding for testing purposes now
  chatGuid?: string

  riddles?: string[]
}

export interface NoteWallData {
  roomWallDescription: string
  noteWallButton: string
  addNoteLinkText: string
  addNotePrompt: string
  noteWallDescription: string
}
