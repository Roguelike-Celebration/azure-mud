import { promisify } from 'util'
import { User, isMod, MinimalUser } from './user'

import Database from './database'
import { RoomNote } from './roomNote'
import redis = require('redis');

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

const Redis: Database = {
  async getActiveUsers() {
    return JSON.parse(await getCache(activeUsersKey)) || []
  },
  async setActiveUsers(users: string[]) {
    return await setCache(activeUsersKey, JSON.stringify(users))
  },

  async getUserHeartbeat(userId: string): Promise<number> {
    return await getCache(heartbeatKeyForUser(userId))
  },

  async setUserHeartbeat(userId: string) {
    await setCache(heartbeatKeyForUser(userId), new Date().valueOf())
  },

  // TODO: This could theoretically use Redis lists
  async setUserAsActive(userId: string) {
    const activeUsers = await Redis.getActiveUsers()
    if (!activeUsers.includes(userId)) {
      activeUsers.push(userId)
      await Redis.setActiveUsers(activeUsers)
    }
  },

  // Room presence

  async roomOccupants(roomId: string) {
    const presenceKey = roomPresenceKey(roomId)
    return JSON.parse(await getCache(presenceKey)) || []
  },

  async setRoomOccupants(roomId: string, occupants: string[]) {
    const presenceKey = roomPresenceKey(roomId)
    await setCache(presenceKey, JSON.stringify(occupants))
  },

  async setCurrentRoomForUser(userId: string, roomId: string) {
    await setCache(roomKeyForUser(userId), roomId)
  },

  async currentRoomForUser(userId: string) {
    return await getCache(roomKeyForUser(userId))
  },

  async addUserToVideoPresence(userId: string, roomId: string) {
    const rawList = await getCache(videoPresenceKey(roomId))
    let list: string[]
    if (!rawList) { list = [] }
    list = JSON.parse(rawList)

    // if (!list.includes(userId)) {
    //   list.push(userId)
    // }

    // await setCache(videoPresenceKey(roomId), list)
    // return list
    return []
  },

  async removeUserFromVideoPresence(userId: string, roomId: string) {
    const rawList = await getCache(videoPresenceKey(roomId))
    let list: string[]
    if (!rawList) { list = [] }
    list = JSON.parse(rawList)

    // list = list.filter(l => l !== userId)

    // await setCache(videoPresenceKey(roomId), list)
    // return list
    return []
  },

  // User
  async getPublicUser(userId: string) {
    const userData = await getCache(profileKeyForUser(userId))

    if (!userData) {
      return undefined
    }

    const user: User = JSON.parse(userData)

    if (isMod(user.id)) {
      user.isMod = true
    }

    return user
  },

  async setUserProfile(userId: string, data: User) {
    delete data.isMod
    return await setCache(profileKeyForUser(userId), JSON.stringify(data))
  },

  async getMinimalProfileForUser(userId: string) {
    const user = JSON.parse(await getCache(usernameKeyForUser(userId)))

    if (isMod(userId)) {
      user.isMod = true
    }
    return user
  },

  async setMinimalProfileForUser(userId: string, data: MinimalUser) {
    delete data.isMod
    delete data.isBanned
    return await setCache(usernameKeyForUser(userId), JSON.stringify(data))
  },

  async lastShoutedForUser(userId: string) {
    const date = await getCache(shoutKeyForUser(userId))
    if (date) {
      return new Date(JSON.parse(date))
    }
  },

  async userJustShouted(userId: string) {
    await setCache(shoutKeyForUser(userId), JSON.stringify(new Date()))
  },

  // Because this data lives in both the minimal user profile and the real user data,
  // we need to read/write in two places. Sigh.
  async banUser(userId: string) {
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

  async unbanUser(userId: string) {
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

  // Post-it notes
  async addRoomNote(roomId: string, note: RoomNote) {
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

  async deleteRoomNote(roomId: string, noteId: string) {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    notes = notes.filter(n => n.id !== noteId)

    await setCache(roomNotesKey(roomId), JSON.stringify(notes))
  },

  async likeRoomNote(roomId: string, noteId: string, userId: string) {
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

  async unlikeRoomNote(roomId: string, noteId: string, userId: string) {
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

  async getRoomNotes(roomId: string): Promise<RoomNote[]> {
    const rawNotes = await getCache(roomNotesKey(roomId))
    let notes: RoomNote[] = []
    if (rawNotes) {
      notes = JSON.parse(rawNotes)
    }

    return notes
  }
}

const activeUsersKey = 'activeUsersList'

function shoutKeyForUser(user: string): string {
  return `${user}Shout`
}

function usernameKeyForUser(userId: string): string {
  return `${userId}Handle`
}

function profileKeyForUser(userId: string): string {
  return `${userId}Profile`
}

function heartbeatKeyForUser(user: string): string {
  return `${user}Heartbeat`
}

export function roomPresenceKey(roomName: string): string {
  return `${roomName}Presence`
}

export function roomKeyForUser(user: string): string {
  return `${user}Room`
}

export function roomKey(name: string) {
  return `${name}RoomData`
}

export function roomNotesKey(roomId: string): string {
  return `${roomId}Notes`
}

export function videoPresenceKey(roomId: string) {
  return `${roomId}PresenceVideo`
}

export default Redis
