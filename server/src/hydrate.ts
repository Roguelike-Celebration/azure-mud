import { getCache, roomKeyForUser, setCache, shoutKeyForUser } from "./redis";
import { User } from "./user";
import { roomData } from "./room";

export async function hydrateUser(userId: string): Promise<User> {
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
    roomId,
    room: roomData[roomId],
    lastShouted,
  };
}
