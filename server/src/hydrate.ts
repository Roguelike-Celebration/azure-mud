import { getCache, roomKeyForUser, setCache } from "./redis";
import { User } from "./user";
import { roomData } from "./room";

export async function hydrateUser(userId: string): Promise<User> {
  let roomId = await getCache(roomKeyForUser(userId));
  if (!roomId) {
    roomId = "kitchen";
    await setCache(roomKeyForUser(userId), roomId);
  }

  return {
    id: userId,
    roomId,
    room: roomData[roomId],
  };
}
