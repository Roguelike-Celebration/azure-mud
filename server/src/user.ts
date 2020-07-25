import { Room } from "./room";
import DB from "./redis";
import { roomData } from "./room";
import { invert } from "lodash";

// TODO: pronouns (and realName?) shouldn't be optional
// but leaving like this til they actually exist in the DB.

// A user profile. Users may fetch this about other users.
export interface PublicUser {
  id: string;
  username: string;
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

export async function getUserIdForUsername(username: string) {
  const userMap = invert(await activeUserMap());
  return userMap[username];
}

export async function updateUserProfile(userId: string, data: Partial<User>) {
  const profile = (await DB.getPublicUser(userId)) || {};
  const newProfile: User = { ...profile, ...data } as User; // TODO: Could use real validation here?
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

export async function activeUserMap(): Promise<{ [userId: string]: string }> {
  const userIds = await DB.getActiveUsers();
  let names = await Promise.all(
    userIds.map(async (u) => await DB.getUsernameForUserId(u))
  );

  let map = {};
  for (let i = 0; i < userIds.length; i++) {
    map[userIds[i]] = names[i];
  }

  console.log(userIds, names, map);

  return map;
}
