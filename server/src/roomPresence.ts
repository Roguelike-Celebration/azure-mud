import DB from './redis'

export async function addUserToRoomPresence(
  userId: string,
  roomId: string
): Promise<string[]> {
  const roomOccupants = await DB.roomOccupants(roomId)

  if (roomOccupants.indexOf(userId) === -1) {
    roomOccupants.push(userId)
    await DB.setRoomOccupants(roomId, roomOccupants)
  }

  await DB.setCurrentRoomForUser(userId, roomId)

  return roomOccupants
}

export async function removeUserFromRoomPresence(
  userId: string,
  roomId: string
): Promise<string[]> {
  const roomOccupants = await DB.roomOccupants(roomId)

  const newPresence = roomOccupants.filter((n) => n !== userId)
  await DB.setRoomOccupants(roomId, newPresence)

  return newPresence
}
