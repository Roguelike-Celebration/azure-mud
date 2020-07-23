import { getCache, setCache, shoutKeyForUser } from "./redis";
import { User } from "./user";
import { roomData } from "./room";
import { roomKeyForUser } from "./roomPresence";

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

  return {
    id: userId,
    username,
    roomId,
    room: roomData[roomId],
    lastShouted,
  };
}
