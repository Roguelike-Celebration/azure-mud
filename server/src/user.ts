import { Room, roomData } from './room'
import DB from './redis'

// TODO: pronouns (and realName?) shouldn't be optional
// but leaving like this til they actually exist in the DB.

// The bare minimum amount of user information we need to send
// about every user to every other user on login
export interface MinimalUser {
  id: string;
  username: string;
  pronouns?: string;
  isMod?: boolean;
  isBanned?: boolean;
}

// A user profile. Users may fetch this about other users.
export interface PublicUser extends MinimalUser {
  realName?: string;
  pronouns?: string;
  description?: string;
  askMeAbout?: string;
  twitterHandle?: string;
  url?: string;
}

// A private representation of the current user
// contains info we may not want to publicly expose.
export interface User extends PublicUser {
  roomId: string;
  lastShouted?: Date;

  // Right now, fetching a room given a roomId doesn't hit redis.
  // If that changes, we might want to make this lazy
  room: Room;
}

export async function isMod (userId: string) {
  const modList = await DB.modList()
  return modList.includes(userId)
}

export async function getUserIdForOnlineUsername (username: string) {
  // This currently only checks active users, by intention
  // If we used all users, that would mistakenly let you e.g. send messages to offline users
  // (who would never get the message)
  const userMap = await activeUserMap()
  const user = Object.values(userMap).find((u) => u.username === username)
  if (user) {
    return user.id
  }
}

export async function getUserIdForUsername (username: string) {
  // This currently only checks active users, by intention
  // If we used all users, that would mistakenly let you e.g. send messages to offline users
  // (who would never get the message)
  const userMap = await DB.minimalProfileUserMap()
  const user = Object.values(userMap).find((u) => u.username === username)
  if (user) {
    return user.id
  }
}

export async function updateUserProfile (userId: string, data: Partial<User>) {
  // Copy/pasted from ProfileEditView.tsx in the client
  function crushSpaces (s: string): string {
    if (s.includes(' ')) {
      console.log('spaces detected ' + s)
      while (s.includes(' ')) {
        s = s.replace(' ', '-')
      }
      console.log('spaces crushed: ' + s)
    }
    return s
  }

  const profile: Partial<User> = (await DB.getPublicUser(userId)) || {}
  const username = crushSpaces(data.username) || profile.username
  const newProfile: User = {
    ...profile,
    ...data,
    id: userId,
    username
  } as User // TODO: Could use real validation here?

  const minimalProfile: MinimalUser = {
    id: userId,
    username: username
  }
  if (newProfile.pronouns) {
    minimalProfile.pronouns = newProfile.pronouns
  }
  // This may need to get fancier if MinimalProfile grows
  await DB.setMinimalProfileForUser(userId, minimalProfile)

  await DB.setUserProfile(userId, newProfile)
  return newProfile
}

export async function getFullUser (userId: string): Promise<User | undefined> {
  const profile = await DB.getPublicUser(userId)
  if (!profile) return

  let roomId = await DB.currentRoomForUser(userId)
  if (!roomId) {
    roomId = 'entryway'
    await DB.setCurrentRoomForUser(userId, roomId)
  }

  const lastShouted = await DB.lastShoutedForUser(userId)

  return {
    ...profile,
    id: userId,
    roomId,
    room: roomData[roomId],
    lastShouted
  }
}

export async function minimizeUser (user: User | PublicUser): Promise<MinimalUser> {
  const minimalUser: MinimalUser = {
    id: user.id,
    username: user.username,
    isBanned: user.isBanned
  }
  if (await isMod(user.id)) {
    minimalUser.isMod = true
  }

  return minimalUser
}

export async function activeUserMap (): Promise<{
  [userId: string]: MinimalUser;
}> {
  const userIds = await DB.getActiveUsers()
  const names: MinimalUser[] = await Promise.all(
    userIds.map(async (u) => await DB.getMinimalProfileForUser(u))
  )

  const map: { [userId: string]: MinimalUser } = {}
  for (let i = 0; i < userIds.length; i++) {
    map[userIds[i]] = names[i]
  }

  console.log(userIds, names, map)

  return map
}
