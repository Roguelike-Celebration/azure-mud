import { User, MinimalUser } from './user'
import { RoomNote } from './roomNote'
import { ServerSettings } from './types'

interface Database {
  // -----------------------------------------------------------------
  // WORLD PRESENCE
  // -----------------------------------------------------------------

  /** Returns an array of user IDs for all active logged-in users */
  getActiveUsers(): Promise<User[]>;

  /** Adds a user to the current list of logged-in users */
  setUserAsActive(userId: string, active: boolean);

  /** Sets the current Unix timestamp for a user pinging in */
  setUserHeartbeat(userId: string);

  // -----------------------------------------------------------------
  // ROOM PRESENCE
  // -----------------------------------------------------------------

  /** Returns an array of userIds who are currently in the given room */
  roomOccupants(roomId: string): Promise<string[]>;

  setCurrentRoomForUser(userId: string, roomId: string);

  /** Returns the room ID for the room a user is currently in */
  currentRoomForUser(userId: string): Promise<string | undefined>;

  updateVideoPresenceForUser (userId: string, roomId?: string);

  /* Returns a list of users currently in videochat */
  getVideoPresenceForRoom(roomId: string): Promise<string[]>

  // -----------------------------------------------------------------
  // USER DATA
  // -----------------------------------------------------------------

  /** Returns public profile data for a given user */
  getPublicUser(userId: string): Promise<User | undefined>;

  /** Overwrites the stored user profile with a new one */
  setUserProfile(userId: string, data: User): Promise<User>;

  /** Sets that the user shouted right now */
  userJustShouted(userId: string);

  setModStatus(userId: string, isMod: boolean)

  modList(): Promise<string[]>

  // -----------------------------------------------------------------
  // SETTINGS DATA
  // -----------------------------------------------------------------
  /** Will return default values if no server settings are set */
  getServerSettings(): Promise<ServerSettings>;

  setServerSettings(serverSettings: ServerSettings): Promise<ServerSettings>;

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

  setWebhookDeployKey(key)
}

// eslint-disable-next-line no-undef
export default Database
