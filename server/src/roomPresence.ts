import { getCache, setCache } from "./redis";

export async function addUserToRoomPresence(
  user: string,
  roomId: string
): Promise<string[]> {
  const presenceKey = roomPresenceKey(roomId);
  const roomOccupants: string[] = JSON.parse(await getCache(presenceKey)) || [];

  if (roomOccupants.indexOf(user) === -1) {
    const newPresence = roomOccupants.concat([user]);
    await setCache(presenceKey, JSON.stringify(newPresence));
  }

  await setCache(roomKeyForUser(user), roomId);

  return roomOccupants;
}

export async function removeUserFromRoomPresence(
  userId: string,
  roomId: string
): Promise<string[]> {
  const presenceKey = roomPresenceKey(roomId);
  const roomOccupants: string[] = JSON.parse(await getCache(presenceKey)) || [];

  const newPresence = roomOccupants.filter((n) => n !== userId);
  await setCache(presenceKey, JSON.stringify(newPresence));

  return roomOccupants;
}

export function roomPresenceKey(roomName: string): string {
  return `${roomName}Presence`;
}

export function roomKeyForUser(user: string): string {
  return `${user}Room`;
}

export function roomKey(name: string) {
  return `${name}RoomData`;
}
