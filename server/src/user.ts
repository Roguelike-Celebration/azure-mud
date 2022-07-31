import { DB } from './database'

// TODO: If we have tooltip popups showing profile info,
// the distinction between a 'full' and 'minimal' user is no longer useful
// We can just collapse the two
// (especially since the db just stores full user and we minimize in JS)

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
  // From https://www.w3schools.com/colors/colors_names.asp
  nameColor?: string;
  item?: string
  polymorph?: string;
  fontReward?: string;
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

  // Currently only exists to give CosmosDB a partitionKey
  hostname: string;

  heartbeat: number;
}

export async function isMod (userId: string) {
  const modList = await DB.modList()
  return modList.includes(userId)
}

export async function updateModStatus (userId: string) {
  const userIsMod = await isMod(userId)

  const profile = await DB.getUser(userId)

  if (!profile) {
    console.log('ERROR: Could not find user ', userId)
    return
  }

  await DB.setUserProfile(userId, { ...profile, isMod: userIsMod })
}

export async function getUserIdForOnlineUsername (username: string) {
  // This currently only checks active users, by intention
  // If we used all users, that would mistakenly let you e.g. send messages to offline users
  // (who would never get the message)
  return DB.getUserIdForUsername(username, true)
}

export async function getUserIdForUsername (username: string) {
  return DB.getUserIdForUsername(username, false)
}

export async function updateUserProfile (userId: string, data: Partial<User>, isNew: boolean = false) {
  console.log('In updateUserProfile', data, isNew)
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

  const profile: Partial<User> = (await DB.getUser(userId)) || {}
  let username = profile.username
  if (data.username) { username = crushSpaces(data.username) }
  // If someone's trying to set a new username, validate it
  if (data.username && profile.username !== username) {
    console.log('Validating username', username)
    const userIdForNewUsername = await getUserIdForUsername(username)
    console.log('userIdForUsername result:', userIdForNewUsername)
    if (userIdForNewUsername && userIdForNewUsername !== userId) {
      throw new Error(`Username '${username}' is already taken`)
    }
  }
  console.log('Past existing username check')
  const newProfile: User = {
    ...profile,
    ...data,
    id: userId,
    username,
    isMod: profile.isMod
  } as User // TODO: Could use real validation here?
  console.log('New profile data', newProfile)

  const result = await DB.setUserProfile(userId, newProfile)
  console.log('Update user result', result)
  return newProfile
}

export async function updateUserProfileColor (userId: string, color: string): Promise<MinimalUser> {
  const profile: User = await DB.getUser(userId)
  profile.nameColor = color
  await DB.setUserProfile(userId, profile)

  return minimizeUser(profile)
}

export async function updateUserFontReward (userId: string, font: string): Promise<MinimalUser> {
  const profile: User = await DB.getUser(userId)
  profile.fontReward = font
  await DB.setUserProfile(userId, profile)

  return minimizeUser(profile)
}

export async function getFullUser (userId: string): Promise<User | undefined> {
  const profile = await DB.getUser(userId)
  if (!profile) return

  if (!profile.roomId) {
    profile.roomId = 'entryway'
    await DB.setCurrentRoomForUser(profile, profile.roomId)
  }

  return {
    ...profile,
    id: userId
  }
}

export function minimizeUser (user: User | PublicUser): MinimalUser {
  const minimalUser: MinimalUser = {
    id: user.id,
    username: user.username,
    isBanned: user.isBanned,
    nameColor: user.nameColor,
    item: user.item,
    polymorph: user.polymorph,
    isMod: user.isMod,
    fontReward: user.fontReward
  }

  return minimalUser
}
