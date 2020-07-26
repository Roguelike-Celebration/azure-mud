import { Room } from "./room";
import DB from "./redis";
import { roomData } from "./room";

// TODO: pronouns (and realName?) shouldn't be optional
// but leaving like this til they actually exist in the DB.

// The bare minimum amount of user information we need to send
// about every user to every other user on login
export interface MinimalUser {
  id: string;
  username: string;
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

export function isMod(userId: string) {
  const modList = ["19924413"];
  return modList.includes(userId);
}

export async function getUserIdForUsername(username: string) {
  const userMap = await activeUserMap();
  const user = Object.values(userMap).find((u) => u.username === username);
  if (user) {
    return user.id;
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>) {
  const profile = (await DB.getPublicUser(userId)) || {};
  const newProfile: User = { ...profile, ...data, id: userId } as User; // TODO: Could use real validation here?

  // This may need to get fancier if MinimalProfile grows
  await DB.setMinimalProfileForUser(userId, {
    id: userId,
    username: newProfile.username,
  });

  return await DB.setUserProfile(userId, newProfile);
}

export async function getFullUser(userId: string): Promise<User | undefined> {
  const profile = await DB.getPublicUser(userId);
  if (!profile) return;

  let roomId = await DB.currentRoomForUser(userId);
  if (!roomId) {
    roomId = "kitchen";
    await DB.setCurrentRoomForUser(userId, roomId);
  }

  let lastShouted = await DB.lastShoutedForUser(userId);

  return {
    ...profile,
    id: userId,
    roomId,
    room: roomData[roomId],
    lastShouted,
  };
}

export function minimizeUser(user: User | PublicUser): MinimalUser {
  const minimalUser: MinimalUser = {
    id: user.id,
    username: user.username,
    isBanned: user.isBanned,
  };
  if (isMod(user.id)) {
    minimalUser.isMod = true;
  }

  return minimalUser;
}

export async function activeUserMap(): Promise<{
  [userId: string]: MinimalUser;
}> {
  const userIds = await DB.getActiveUsers();
  let names: MinimalUser[] = await Promise.all(
    userIds.map(async (u) => await DB.getMinimalProfileForUser(u))
  );

  let map: { [userId: string]: MinimalUser } = {};
  for (let i = 0; i < userIds.length; i++) {
    map[userIds[i]] = names[i];
  }

  console.log(userIds, names, map);

  return map;
}
