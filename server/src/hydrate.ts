import {
  getCache,
  setCache,
  shoutKeyForUser,
  usernameKeyForUser,
} from "./redis";
import { User } from "./user";
import { roomData } from "./room";
import { roomKeyForUser } from "./roomPresence";
import { getActiveUsers } from "./heartbeat";

export async function hydrateUser(
  userId: string,
  username?: string
): Promise<User> {
  let roomId = await getCache(roomKeyForUser(userId));
  if (!roomId) {
    roomId = "kitchen";
    await setCache(roomKeyForUser(userId), roomId);
  }

  let lastShouted = await getCache(shoutKeyForUser(userId));
  if (lastShouted) {
    lastShouted = new Date(JSON.parse(lastShouted));
  }

  if (username) {
    await setCache(usernameKeyForUser(userId), username);
  } else {
    username = await getCache(usernameKeyForUser(userId));
  }

  return {
    id: userId,
    username,
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
