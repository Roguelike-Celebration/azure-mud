import { MinimalRoom, Room } from './rooms'
import { User, MinimalUser, PublicUser } from './user'
import { RoomNote } from './roomNote'
import { Badge } from './badges'

export interface HappeningNowEntry {
  text: string,
  roomId?: string,
  externalLink?: string
}

function isHappeningNowEntry (obj: any): obj is HappeningNowEntry {
  return obj.text && (typeof obj.text === 'string' || obj.text instanceof String) &&
    obj.roomId ? (typeof obj.roomId === 'string' || obj.roomId instanceof String) : true &&
    obj.externalLink ? (typeof obj.externalLink === 'string' || obj.externalLink instanceof String) : true
}

export interface ServerSettings {
  movementMessagesHideThreshold: number;
  movementMessagesHideRoomIds: string[];
  happeningNowEntries: HappeningNowEntry[];
  spaceIsClosed: boolean
  webhookDeployKey?: string
}

export const DEFAULT_SERVER_SETTINGS: ServerSettings = {
  movementMessagesHideThreshold: 20,
  movementMessagesHideRoomIds: ['theater'],
  happeningNowEntries: [],
  spaceIsClosed: false
}

// There's 100% a more elegant way to do this, but I think this works and want to actually get this feature finally done.
export function toServerSettings (obj: Partial<ServerSettings>): ServerSettings | null {
  try {
    if (obj.movementMessagesHideThreshold === undefined || obj.movementMessagesHideRoomIds === undefined ||
        (obj.happeningNowEntries && !obj.happeningNowEntries.every(isHappeningNowEntry))) {
      console.log('Returning null in toServerSettings')
      return null
    } else {
      return {
        movementMessagesHideThreshold: obj.movementMessagesHideThreshold,
        movementMessagesHideRoomIds: obj.movementMessagesHideRoomIds,
        happeningNowEntries: obj.happeningNowEntries || [],
        spaceIsClosed: !!obj.spaceIsClosed
      }
    }
  } catch (e) {
    console.log('Error in toServerSettings', e)
    return null
  }
}

export interface RoomResponse {
  roomId: string;
  presenceData?: { [roomId: string]: string[] };
  users?: { [userId: string]: MinimalUser };
  roomData?: { [roomId: string]: Room };
  profile?: User;
  roomNotes?: RoomNote[]
  unlockableBadges?: Badge[]
}

export interface ErrorResponse {
  error: string;
}

export interface ProfileResponse {
  user: User;
}

export enum ValidColors {
  Blue = 'Blue',
  Cyan = 'Cyan',
  Green = 'Green',
  Lime = 'Lime',
  Olive = 'Olive',
  Magenta = 'Magenta',
  Orange = 'Orange',
  Red = 'Red',
  Violet = 'Violet',
  Yellow = 'Yellow'
}

export enum ValidFontRewards {
  Comic = 'Comic',
  Classic = 'Classic',
  Impactful = 'Impactful'
}

export enum BadgeCategories {
  Default = 'DEFAULT',
  Year2022 = 'YEAR_2022',
  Talk2022 = 'TALK_2022',
  Special = 'SPECIAL',
  Year2023 = 'YEAR_2023',
  Talk2023 = 'TALK_2023',
  Year2024 = 'YEAR_2024',
  Talk2024 = 'TALK_2024',
  Year2025 = 'YEAR_2025',
  Talk2025 = 'TALK_2025'
}
