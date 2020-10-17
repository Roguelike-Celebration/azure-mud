import { promisify } from 'util'
import { User, isMod, MinimalUser } from './user'
import { ServerSettings, DEFAULT_SERVER_SETTINGS, toServerSettings } from './types'
import Database from './database'
import { RoomNote } from './roomNote'
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

const Redis: Database = {
  async getActiveUsers () {
    return getSet(activeUsersKey) || []
  },

  async getUserHeartbeat (userId: string): Promise<number> {
    return await getCache(heartbeatKeyForUser(userId))
  },

  async setUserHeartbeat (userId: string) {
    await setCache(heartbeatKeyForUser(userId), new Date().valueOf())
  },

  async setUserAsActive (userId: string) {
    return await addToSet(activeUsersKey, userId)
  },

  async setUserAsInactive (userId: string) {
    return await removeFromSet(activeUsersKey, userId)
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

  async setCurrentRoomForUser (userId: string, roomId: string) {
    await setCache(roomKeyForUser(userId), roomId)
  },

  async currentRoomForUser (userId: string) {
    return await getCache(roomKeyForUser(userId))
  },

  async addUserToVideoPresence (userId: string, roomId: string) {
    await addToSet(videoPresenceKey(roomId), userId)
  },

  async removeUserFromVideoPresence (userId: string, roomId: string) {
    await removeFromSet(videoPresenceKey(roomId), userId)
  },

  async getVideoPresenceForRoom (roomId: string) {
    return await getSet(videoPresenceKey(roomId)) || []
  },

  // User
  async getPublicUser (userId: string) {
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

  async setUserProfile (userId: string, data: User) {
    return await setCache(profileKeyForUser(userId), JSON.stringify(data))
  },

  async getMinimalProfileForUser (userId: string) {
    const user = JSON.parse(await getCache(usernameKeyForUser(userId)))

    if (await isMod(userId)) {
      user.isMod = true
    }
    return user
  },

  async setMinimalProfileForUser (userId: string, data: MinimalUser) {
    delete data.isMod
    delete data.isBanned
    const result = await setCache(usernameKeyForUser(userId), JSON.stringify(data))

    const rawUserMap = await getCache(userMapKey)
    let userMap: {[userId: string]: MinimalUser} = {}
    if (rawUserMap) {
      userMap = JSON.parse(rawUserMap)
    }

    // We don't trust the data the user has sent in from the client
    // so unsetting that field and manually setting it here is the solution!
    if (await isMod(userId)) {
      data.isMod = true
    }
    userMap[userId] = data

    await setCache(userMapKey, JSON.stringify(userMap))
    return result
  },

  async minimalProfileUserMap () {
    return JSON.parse((await getCache(userMapKey) || '{}'))
  },

  async lastShoutedForUser (userId: string) {
    const date = await getCache(shoutKeyForUser(userId))
    if (date) {
      return new Date(JSON.parse(date))
    }
  },

  async userJustShouted (userId: string) {
    await setCache(shoutKeyForUser(userId), JSON.stringify(new Date()))
  },

  // Because this data lives in both the minimal user profile and the real user data,
  // we need to read/write in two places. Sigh.
  async banUser (userId: string) {
    const presenceData = await JSON.parse(
      await getCache(usernameKeyForUser(userId))
    )
    presenceData.isBanned = true
    await setCache(usernameKeyForUser(userId), JSON.stringify(presenceData))

    const profileData = await JSON.parse(
      await getCache(profileKeyForUser(userId))
    )
    profileData.isBanned = true
    await setCache(profileKeyForUser(userId), JSON.stringify(profileData))
  },

  async unbanUser (userId: string) {
    const profile = await JSON.parse(
      await getCache(usernameKeyForUser(userId))
    )
    profile.isBanned = false
    await setCache(usernameKeyForUser(userId), JSON.stringify(profile))

    const profileData = await JSON.parse(
      await getCache(profileKeyForUser(userId))
    )
    profileData.isBanned = false
    await setCache(profileKeyForUser(userId), JSON.stringify(profileData))
  },

  async modList (): Promise<string[]> {
    return await getSet(modListKey) || []
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
  }
}

const activeUsersKey = 'activeUsersList'

const modListKey = 'mods'

const serverSettingsKey = 'serverSettings'

function shoutKeyForUser (user: string): string {
  return `${user}Shout`
}

function usernameKeyForUser (userId: string): string {
  return `${userId}Handle`
}

function profileKeyForUser (userId: string): string {
  return `${userId}Profile`
}

function heartbeatKeyForUser (user: string): string {
  return `${user}Heartbeat`
}

function roomPresenceKey (roomName: string): string {
  return `${roomName}Presence`
}

function roomKeyForUser (user: string): string {
  return `${user}Room`
}

function roomKey (name: string) {
  return `${name}RoomData`
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
