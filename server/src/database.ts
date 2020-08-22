import { User, MinimalUser } from './user'
import { RoomNote } from './roomNote'

interface Database {
  // -----------------------------------------------------------------
  // WORLD PRESENCE
  // -----------------------------------------------------------------

  /** Returns an array of user IDs for all active logged-in users */
  getActiveUsers(): Promise<string[]>;

  /** TODO: Why does this take in all users, not just the new one? */
  setActiveUsers(users: string[]): Promise<void>;

  /** Returns a Unix timestamp for when a user last pinged in */
  getUserHeartbeat(userId: string): Promise<number>;

  /** Sets the current Unix timestamp for a user pinging in */
  setUserHeartbeat(userId: string);

  /** Adds a user to the current list of logged-in users */
  setUserAsActive(userId: string);

  // -----------------------------------------------------------------
  // ROOM PRESENCE
  // -----------------------------------------------------------------

  /** Returns an array of userIds who are currently in the given room */
  roomOccupants(roomId: string): Promise<string[]>;

  /** Take an array of users and overwrite the current presence for the room */
  setRoomOccupants(roomId: string, occupants: string[]);

  // The cache for what room a given user is in is different.
  // This sets a given user as "in" a room.
  // This is a smell!
  setCurrentRoomForUser(userId: string, roomId: string);

  /** Returns the room ID for the room a user is currently in */
  currentRoomForUser(userId: string): Promise<string | undefined>;

  /** Add a user to the videochat presence for a room.
   * Returns a list of users currently in videochat */
  addUserToVideoPresence(userId: string, roomId: string): Promise<string[]>

  /** Removes a user from the videochat presence for a room.
   * Returns a list of users currently in videochat */
  removeUserFromVideoPresence(userId: string, roomId: string): Promise<string[]>

  // -----------------------------------------------------------------
  // USER DATA
  // -----------------------------------------------------------------

  /** Returns public profile data for a given user */
  getPublicUser(userId: string): Promise<User | undefined>;

  /** Overwrites the stored user profile with a new one */
  setUserProfile(userId: string, data: User): Promise<User>;

  /** Given a user ID, returns that player's minimal data.
   * i.e. their username and if they're a mod */
  getMinimalProfileForUser(userId: string): Promise<MinimalUser>;

  setMinimalProfileForUser(
    userId: string,
    data: MinimalUser
  ): Promise<MinimalUser>;

  minimalProfileUserMap(): Promise<{[userId: string]: MinimalUser}>;

  /** Returns a Date for when the user last shouted */
  lastShoutedForUser(userId: string): Promise<Date | undefined>;

  /** Sets that the user shouted right now */
  userJustShouted(userId: string);

  banUser(userId: string);
  unbanUser(userId: string);

  // -----------------------------------------------------------------
  // POST-IT NOTES
  // -----------------------------------------------------------------
  addRoomNote(roomId: string, note: RoomNote)
  deleteRoomNote(roomId: string, noteId: string)

  likeRoomNote(roomId: string, noteId: string, userId: string): Promise<string[]>
  unlikeRoomNote(roomId: string, noteId: string, userId: string): Promise<string[]>

  getRoomNotes(roomId: string): Promise<RoomNote[]>

}

// eslint-disable-next-line no-undef
export default Database
