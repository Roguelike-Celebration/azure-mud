import { Room } from "./room";
import {
  getCache,
  profileKeyForUser,
  setCache,
  shoutKeyForUser,
  usernameKeyForUser,
} from "./redis";
import { roomData } from "./room";
import { roomKeyForUser } from "./roomPresence";
import { getActiveUsers } from "./heartbeat";
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

export async function getPublicUser(userId: string) {
  return JSON.parse(await getCache(profileKeyForUser(userId)));
}

export async function updateUserProfile(userId: string, data: Partial<User>) {
  const profile = (await getPublicUser(userId)) || {};
  const newProfile = { ...profile, ...data };
  return await setCache(profileKeyForUser(userId), JSON.stringify(newProfile));
}

export async function getFullUser(userId: string) {
  const profile = (await getPublicUser(userId)) || {};

  let roomId = await getCache(roomKeyForUser(userId));
  if (!roomId) {
    roomId = "kitchen";
    await setCache(roomKeyForUser(userId), roomId);
  }

  let lastShouted = await getCache(shoutKeyForUser(userId));
  if (lastShouted) {
    lastShouted = new Date(JSON.parse(lastShouted));
  }

  return {
    ...profile,
    id: userId,
    roomId,
    room: roomData[roomId],
    lastShouted,
  };
}

export async function activeUserMap(): Promise<{ [userId: string]: string }> {
  const userIds = await getActiveUsers();
  let names = await Promise.all(
    userIds.map(async (u) => await getCache(usernameKeyForUser(u)))
  );

  let map = {};
  for (let i = 0; i < userIds.length; i++) {
    map[userIds[i]] = names[i];
  }

  return map;
}
