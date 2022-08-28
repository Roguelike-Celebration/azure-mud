import { promisify } from 'util'
import { User, isMod } from './user'
import { ServerSettings, DEFAULT_SERVER_SETTINGS, toServerSettings } from './types'
import { RoomNote } from './roomNote'
import { Room } from './rooms'
import Database from './database'
console.log('HIII?')
// eslint-disable-next-line import/first
import redis from 'redis'
console.log('redis', redis)

const cache = redis.createClient(
  parseInt(process.env.RedisPort),
  process.env.RedisHostname,
  {
    auth_pass: process.env.RedisKey,
    tls: { servername: process.env.RedisHostname }
  }
)

const getCache = promisify(cache.get).bind(cache)
const setCache = promisify(cache.set).bind(cache)
const expireAt = promisify(cache.expireat).bind(cache)
const del = promisify(cache.del).bind(cache)

const addToSet = promisify(cache.sadd).bind(cache)
const removeFromSet = promisify(cache.srem).bind(cache)
const getSet = promisify(cache.smembers).bind(cache)

const redisKeys = promisify(cache.keys).bind(cache)

interface RedisInternal extends Database {
  addOccupantToRoom (roomId: string, userId: string),
  removeOccupantFromRoom (roomId: string, userId: string)

  addMod (userId: string)
  removeMod (userId: string)

  addSpeaker (userId: string)
  removeSpeaker (userId: string)
}

const Redis: RedisInternal = {
  async userIdForFirebaseToken (token: string): Promise<string | undefined> {
    return await getCache(keyForFirebaseToken(token))
  },

  async addFirebaseTokenToCache (token: string, userId: string, expiry: number) {
    // Expiry is set independently instead of using the 4-parameter setCache sig because I tried it and it seemed to
    // silently fail without setting anything.
    await setCache(keyForFirebaseToken(token), userId)
    await expireAt(keyForFirebaseToken(token), expiry)
  },

  async getActiveUsers (): Promise<string[]> {
    return getSet(activeUsersKey) || []
  },

  // TODO: This is potentially unperformant
  // Storing all users as a Redis set is tricky,
  // since profile updates need to replace the existing user,
  // but I'm not sure we can key our JSONified blobs in a set
  async getAllUsers () {
    const allUserIds: string[] = await getSet(allUserIdsKey)
    return await Promise.all(allUserIds.map(async u => {
      return await Redis.getUser(u)
    }))
  },

  async allRoomOccupants (): Promise<{[roomId: string]: string[]}> {
    // TODO: Run "KEYS room_ to get all dynamic rooms"
    const allRoomIds = await Redis.getRoomIds()
    const data = {}
    await Promise.all(allRoomIds.map(async id => {
      const occupants = await Redis.roomOccupants(id)
      data[id] = occupants
    }))
    return data
  },

  async getUserHeartbeat (userId: string): Promise<number> {
    return await getCache(heartbeatKeyForUser(userId))
  },

  async setUserHeartbeat (user: User) {
    await setCache(heartbeatKeyForUser(user.id), new Date().valueOf())
  },

  async setUserAsActive (user: User, isActive: boolean = true) {
    if (isActive) {
      return await addToSet(activeUsersKey, user.id)
    } else {
      await Redis.removeOccupantFromRoom(user.roomId, user.id)
      return await removeFromSet(activeUsersKey, user.id)
    }
  },

  async getUserIdForUsername (username: string, onlineUsersOnly: boolean) {
    const userId = await getCache(userIdKeyForUsername(username))
    if (onlineUsersOnly) {
      const activeUsers = await Redis.getActiveUsers()
      if (!activeUsers.includes(userId)) {
        return undefined
      }
    }
    return userId
  },

  // Room presence

  async roomOccupants (roomId: string) {
    const presenceKey = roomPresenceKey(roomId)
    return await getSet(presenceKey) || []
  },

  async addOccupantToRoom (roomId: string, userId: string) {
    await Redis.setPartialUserProfile(userId, { roomId })

    const presenceKey = roomPresenceKey(roomId)
    return await addToSet(presenceKey, userId)
  },

  async removeOccupantFromRoom (roomId: string, userId: string) {
    // WARNING: Note that this consciously *does not* remove the current roomId
    // from that user's User object.
    // The design here is that, when someone logs off / is set inactive, this is called
    // which removes them from the presence list for this room
    // but leaves their roomId set on their user
    // so that we can remember where they are.
    // TODO: Fetching presence data should just filter by active users instead.
    const presenceKey = roomPresenceKey(roomId)
    return await removeFromSet(presenceKey, userId)
  },

  async setCurrentRoomForUser (user: User, roomId: string) {
    if (user.roomId !== roomId) {
      console.log('Removing from last room')
      await Redis.removeOccupantFromRoom(user.roomId, user.id)
    }

    await Redis.addOccupantToRoom(roomId, user.id)
  },

  async updateVideoPresenceForUser (user: User, isActive: boolean) {
    if (isActive) {
      await addToSet(videoPresenceKey(user.roomId), user.id)
    } else {
      await removeFromSet(videoPresenceKey(user.roomId), user.id)
    }

    return await Redis.getVideoPresenceForRoom(user.roomId)
  },

  async getVideoPresenceForRoom (roomId: string) {
    return await getSet(videoPresenceKey(roomId)) || []
  },

  // User
  async getUser (userId: string) {
    const userData = await getCache(profileKeyForUser(userId))

    if (!userData) {
      return undefined
    }

    const user: User = JSON.parse(userData)
    if (await isMod(user.id)) {
      user.isMod = true
    }

    return user
  },

  async setPartialUserProfile (userId: string, user: Partial<User>): Promise<User> {
    const existingUser = await Redis.getUser(userId)
    const data = { ...existingUser, ...user }
    return await Redis.setUserProfile(userId, data)
  },

  // TODO: it would be great if this function accepted Partial<User>
  async setUserProfile (userId: string, user: User): Promise<User> {
    await setCache(profileKeyForUser(userId), JSON.stringify(user))
    await addToSet(allUserIdsKey, userId)
    await setCache(userIdKeyForUsername(user.username), user.id)

    return user
  },

  async lastShoutedForUser (userId: string) {
    const date = await getCache(shoutKeyForUser(userId))
    if (date) {
      return new Date(JSON.parse(date))
    }
  },

  async userJustShouted (user: User) {
    await setCache(shoutKeyForUser(user.id), JSON.stringify(new Date()))
  },

  // TODO: this used to set some now-deprecated presence data
  // make sure this actually works
  async banUser (user: User, isBanned: boolean = true) {
    const profile = await Redis.getUser(user.id)
    profile.isBanned = isBanned
    await Redis.setUserProfile(user.id, profile)
  },

  async modList (): Promise<string[]> {
    return await getSet(modListKey) || []
  },

  async speakerList (): Promise<string[]> {
    return await getSet(speakerListKey) || []
  },

  async setModStatus (userId: string, isMod: boolean) {
    if (isMod) {
      await Redis.addMod(userId)
    } else {
      await Redis.removeMod(userId)
    }
    const profile = await Redis.getUser(userId)
    profile.isMod = isMod
    await Redis.setUserProfile(userId, profile)
  },

  async addMod (userId: string) {
    await addToSet(modListKey, userId)
  },

  async removeMod (userId: string) {
    await removeFromSet(modListKey, userId)
  },

  async setSpeakerStatus (userId: string, isSpeaker: boolean) {
    if (isSpeaker) {
      await Redis.addSpeaker(userId)
    } else {
      await Redis.removeSpeaker(userId)
    }
    const profile = await Redis.getUser(userId)
    profile.isSpeaker = isSpeaker
    await Redis.setUserProfile(userId, profile)
  },

  async addSpeaker (userId: string) {
    await addToSet(speakerListKey, userId)
  },

  async removeSpeaker (userId: string) {
    await removeFromSet(speakerListKey, userId)
  },

  // Server settings
  async getServerSettings (): Promise<ServerSettings> {
    const rawServerSettings = await getCache(serverSettingsKey)
    if (rawServerSettings) {
      return toServerSettings(JSON.parse(rawServerSettings))
    } else {
      return DEFAULT_SERVER_SETTINGS
    }
  },

  async setServerSettings (serverSettings: ServerSettings): Promise<ServerSettings> {
    const oldServerSettings = await Redis.getServerSettings()
    await setCache(serverSettingsKey, JSON.stringify({ ...oldServerSettings, ...serverSettings }))

    return serverSettings
  },

  // TODO: It would be great to refactor post-its to use Redis sets.
  // That's complicated because we currently store an array of full objects, but deleting/liking is referenced by the ID within the objects

  // Post-it notes
  async addRoomNote (roomId: string, note: RoomNote) {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    if (!notes.find(n => n.id === note.id)) {
      notes.push(note)
    }

    await setCache(roomNotesKey(roomId), JSON.stringify(notes))
  },

  async deleteRoomNote (roomId: string, noteId: string) {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    notes = notes.filter(n => n.id !== noteId)

    await setCache(roomNotesKey(roomId), JSON.stringify(notes))
  },

  async likeRoomNote (roomId: string, noteId: string, userId: string) {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    const note = notes.find(n => n.id === noteId)
    if (note) {
      if (!note.likes) { note.likes = [] }
      if (!note.likes.includes(userId)) {
        note.likes.push(userId)
      }

      await setCache(roomNotesKey(roomId), JSON.stringify(notes))
      return note.likes
    }

    return []
  },

  async unlikeRoomNote (roomId: string, noteId: string, userId: string) {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    const note = notes.find(n => n.id === noteId)
    if (note && note.likes) {
      note.likes = note.likes.filter(n => n !== userId)
      await setCache(roomNotesKey(roomId), JSON.stringify(notes))
      return note.likes
    }
    return []
  },

  async getRoomNotes (roomId: string): Promise<RoomNote[]> {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    return notes
  },

  async isSpaceClosed (): Promise<boolean> {
    return JSON.parse(await getCache(spaceAvailabilityKey))
  },

  async setSpaceAvailability (open: boolean) {
    return await setCache(spaceAvailabilityKey, open)
  },

  //

  async webhookDeployKey () {
    return await getCache('deployWebhookKey')
  },

  async setWebhookDeployKey (key: string) {
    return await setCache('deployWebhookKey', key)
  },

  //

  // This is currently only accessed when resetRoomData is called, and on admin CMS update
  // If that changes, consider adding more security / tightening access to this
  async setRoomData (room: Room) {
    await setCache(roomFuzzySearchKey(room.shortName.replace(' ', '').toUpperCase()), room.id)
    await setCache(roomFuzzySearchKey(room.id.replace(' ', '').toUpperCase()), room.id)
    await setCache(roomFuzzySearchKey(room.displayName.replace(' ', '').toUpperCase()), room.id)

    await addToSet(roomIdsKey, room.id)
    return await setCache(roomDataKey(room.id), JSON.stringify(room))
  },

  async getRoomData (roomId: string): Promise<Room> {
    // TODO: Also fetch note wall data
    return JSON.parse(await getCache(roomDataKey(roomId)))
  },

  async getRoomIdFromFuzzySearch (search: string): Promise<string|undefined> {
    return await getCache(roomFuzzySearchKey(search))
  },

  async deleteRoomData (roomId: string): Promise<void> {
    await removeFromSet(roomId)
    return await del(roomDataKey(roomId))
  },

  async getRoomIds (): Promise<string[]> {
    return (await getSet(roomIdsKey)) || []
  }
}

const activeUsersKey = 'activeUsersList'

const modListKey = 'mods'
const speakerListKey = 'mods'

const serverSettingsKey = 'serverSettings'

const allUserIdsKey = 'allUserIds'

const roomIdsKey = 'roomIds'

function roomDataKey (roomId: string): string {
  return `room_${roomId}`
}

function shoutKeyForUser (user: string): string {
  return `${user}Shout`
}

function profileKeyForUser (userId: string): string {
  return `${userId}Profile`
}

function userIdKeyForUsername (username: string): string {
  return `${username}Username`
}

function keyForFirebaseToken (token: string): string {
  return `${token}FirebaseToken`
}

function heartbeatKeyForUser (user: string): string {
  return `${user}Heartbeat`
}

function roomPresenceKey (roomName: string): string {
  return `${roomName}Presence`
}

function roomFuzzySearchKey (search: string): string {
  return `${search}RoomSearch`
}

function roomNotesKey (roomId: string): string {
  return `${roomId}Notes`
}

export function videoPresenceKey (roomId: string) {
  return `${roomId}PresenceVideo`
}
const userMapKey = 'userMap'
const spaceAvailabilityKey = 'spaceIsClosed'

export default Redis
