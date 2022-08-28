import { User } from './user'
import { RoomNote } from './roomNote'
import { ServerSettings } from './types'

import Redis from './redis'
import { Room } from './rooms'

interface Database {
  // -----------------------------------------------------------------
  // FIREBASE TOKEN CACHE
  // -----------------------------------------------------------------
  // If the token is in the cache, but not current, this will return false and evict it
  userIdForFirebaseToken(token: string): Promise<string | undefined>

  addFirebaseTokenToCache(token: string, userId: string, expiry: number)

  // -----------------------------------------------------------------
  // WORLD PRESENCE
  // -----------------------------------------------------------------

  /** Returns an array of users for all active logged-in users */
  getActiveUsers(): Promise<string[]>;

  /** Returns all registered user objects */
  getAllUsers(): Promise<User[]>;

  /** Returns a mapping from room IDs to the user IDs of each user in there */
  allRoomOccupants(): Promise<{[roomId: string]: string[]}>;

  /** Adds a user to the current list of logged-in users */
  setUserAsActive(user: User, active: boolean);

  /** Sets the current Unix timestamp for a user pinging in */
  setUserHeartbeat(user: User);

  getUserHeartbeat (user: string): Promise<number>

  getUserIdForUsername(username: string, onlineUsersOnly: boolean)

  // -----------------------------------------------------------------
  // ROOM PRESENCE
  // -----------------------------------------------------------------

  /** Returns an array of userIds who are currently in the given room */
  roomOccupants(roomId: string): Promise<string[]>;

  /** Removes a user from their current room, and adds them to a new room */
  setCurrentRoomForUser(user: User, roomId: string);

  /** Updates the status and returns an array of userIds with active video in the given user's room */
  updateVideoPresenceForUser (user: User, isActive: boolean): Promise<string[]>;

  /* Returns a list of users currently in videochat */
  getVideoPresenceForRoom(roomId: string): Promise<string[]>

  // -----------------------------------------------------------------
  // USER DATA
  // -----------------------------------------------------------------

  /** Returns public profile data for a given user */
  getUser(userId: string): Promise<User | undefined>;

  /** Overwrites the stored user profile with a new one */
  setUserProfile(userId: string, data: User): Promise<User>;

  setPartialUserProfile (userId: string, user: Partial<User>): Promise<User>

  /** Sets that the user shouted right now */
  userJustShouted(user: User);

  lastShoutedForUser (userId: string)

  setModStatus(userId: string, isMod: boolean)

  setSpeakerStatus(userId: string, isSpeaker: boolean)

  banUser(user: User, isBanned: boolean)

  modList(): Promise<string[]>
  speakerList(): Promise<string[]>

  // -----------------------------------------------------------------
  // SETTINGS DATA
  // -----------------------------------------------------------------
  /** Will return default values if no server settings are set */
  getServerSettings(): Promise<ServerSettings>;

  // TODO: This partial here is complicated
  // CosmosDB allows partials; Redis (the way we're using it) does not
  setServerSettings(serverSettings: Partial<ServerSettings>): Promise<ServerSettings>;

  // -----------------------------------------------------------------
  // POST-IT NOTES
  // -----------------------------------------------------------------
  addRoomNote(roomId: string, note: RoomNote)
  deleteRoomNote(roomId: string, noteId: string)

  likeRoomNote(roomId: string, noteId: string, userId: string): Promise<string[]>
  unlikeRoomNote(roomId: string, noteId: string, userId: string): Promise<string[]>

  getRoomNotes(roomId: string): Promise<RoomNote[]>

  // -----------------------------------------------------------------
  // AVAILABILITY
  // -----------------------------------------------------------------
  isSpaceClosed(): Promise<boolean>
  setSpaceAvailability(open: boolean)

  // If you want to notify clients a new build has been deployed,
  // you need to include the key that's hardcoded into Redis
  webhookDeployKey()

  setWebhookDeployKey(key: string)

  // -----------------------------------------------------------------
  // ROOM DATA
  // -----------------------------------------------------------------
  setRoomData(room: Room)
  deleteRoomData(roomId: string): Promise<void>
  getRoomData(roomId: string): Promise<Room>
  getRoomIds(): Promise<string[]>

  // When someone types /move [room], we generously try to interpret that
  // however we can. This uses a special cache for possible terms.
  getRoomIdFromFuzzySearch (search: string): Promise<string|undefined>
}

// eslint-disable-next-line no-undef
export default Database
export { Redis as DB }
