import { DB } from './database'
import { Badge, FreeBadges } from './badges'
import { uniqWith } from 'lodash'

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
  isSpeaker?: boolean // TODO: Currently never set
  isBanned?: boolean;
  // From https://www.w3schools.com/colors/colors_names.asp
  nameColor?: string;
  item?: string
  polymorph?: string;
  fontReward?: string;

  equippedBadges?: Badge[]
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

  // Does this need to be in PublicUser?
  unlockedBadges: Badge[]
}

export async function isMod (userId: string) {
  const modList = await DB.modList()
  return modList.includes(userId)
}

export async function isSpeaker (userId: string) {
  const speakerList = await DB.speakerList()
  return speakerList.includes(userId)
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

// Copy/pasted from ProfileEditView.tsx in the client
function sanitizeString (s: string, maxLength: number): string {
  // Strip RTL/LTR characters
  s = s.replace(/[‮‏]/g, '')
  s = s.length > maxLength ? s.substring(0, maxLength) : s
  return s
}

// Copy/pasted from ProfileEditView.tsx in the client
function sanitizeUsername (s: string) : string {
  return sanitizeString(s.replace(' ', '-'), 40)
}

export async function updateUserProfile (userId: string, data: Partial<User>, isNew: boolean = false) {
  console.log('In updateUserProfile', data, isNew)

  const profile: Partial<User> = (await DB.getUser(userId)) || {}
  let username = profile.username
  if (data.username) { username = sanitizeUsername(data.username) }
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

  // Limit other field lengths
  if (data.realName) { data.realName = sanitizeString(data.realName, 200) }
  if (data.description) { data.description = sanitizeString(data.description, 200) }
  if (data.pronouns) { data.pronouns = sanitizeString(data.realName, 40) }
  if (data.url) { data.url = sanitizeString(data.url, 200) }
  if (data.twitterHandle) { data.twitterHandle = sanitizeString(data.twitterHandle, 20) }
  if (data.askMeAbout) { data.askMeAbout = sanitizeString(data.askMeAbout, 200) }

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

export async function awardUserBadge (userId: string, badge: Badge) {
  // TODO: This will need to notify the player
  // And maybe has to happen at the caller instead of in here
  const profile: User = await DB.getUser(userId)
  const newBadgeList = (profile.unlockedBadges || []).concat(badge)
  profile.unlockedBadges = uniqWith(newBadgeList, (a, b) => a.emoji === b.emoji)

  return await DB.setUserProfile(userId, profile)
}

export async function equipBadge (userId: string, badge: Badge, index: number) {
  const profile: User = await DB.getUser(userId)
  profile.equippedBadges = (profile.equippedBadges || [])
  profile.equippedBadges[index] = badge
  return await DB.setUserProfile(userId, profile)
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

  profile.unlockedBadges = (profile.unlockedBadges || [])
    .concat(FreeBadges)

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
    fontReward: user.fontReward,
    equippedBadges: user.equippedBadges
  }

  return minimalUser
}
