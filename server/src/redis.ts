import { promisify } from 'util'
import { User, isMod } from './user'
import { ServerSettings, DEFAULT_SERVER_SETTINGS, toServerSettings } from './types'
import { RoomNote } from './roomNote'
import { roomData } from './rooms'
import Database from './database'
import redis = require('redis')

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

const addToSet = promisify(cache.sadd).bind(cache)
const removeFromSet = promisify(cache.srem).bind(cache)
const getSet = promisify(cache.smembers).bind(cache)

interface RedisInternal extends Database {
  addOccupantToRoom (roomId: string, userId: string),
  removeOccupantFromRoom (roomId: string, userId: string)

    addMod (userId: string)
    removeMod (userId: string)
}

const Redis: RedisInternal = {
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
    const allRoomIds = Object.keys(roomData)
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
    const presenceKey = roomPresenceKey(roomId)
    return await addToSet(presenceKey, userId)
  },

  async removeOccupantFromRoom (roomId: string, userId: string) {
    const presenceKey = roomPresenceKey(roomId)
    return await removeFromSet(presenceKey, userId)
  },

  async setCurrentRoomForUser (user: User, roomId: string) {
    await Redis.addOccupantToRoom(roomId, user.id)

    if (user.roomId !== roomId) {
      await Redis.removeOccupantFromRoom(user.roomId, user.id)
    }
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
    console.log('Got user data', userId, userData)

    if (!userData) {
      return undefined
    }

    const user: User = JSON.parse(userData)
    console.log('Parsed user', user)
    if (await isMod(user.id)) {
      user.isMod = true
    }

    return user
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

  async setModStatus (user: User, isMod: boolean) {
    if (isMod) {
      return await Redis.addMod(user.id)
    } else {
      return await Redis.removeMod(user.id)
    }
  },

  async addMod (userId: string) {
    await addToSet(modListKey, userId)
  },

  async removeMod (userId: string) {
    await removeFromSet(modListKey, userId)
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
    await setCache(serverSettingsKey, JSON.stringify(serverSettings))

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
  }
}

const activeUsersKey = 'activeUsersList'

const modListKey = 'mods'

const serverSettingsKey = 'serverSettings'

const allUserIdsKey = 'allUserIds'

function shoutKeyForUser (user: string): string {
  return `${user}Shout`
}

function profileKeyForUser (userId: string): string {
  return `${userId}Profile`
}

function userIdKeyForUsername (username: string): string {
  return `${username}Username`
}

function heartbeatKeyForUser (user: string): string {
  return `${user}Heartbeat`
}

function roomPresenceKey (roomName: string): string {
  return `${roomName}Presence`
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
