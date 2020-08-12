import * as Server from '../server/src/room'
export interface Room {
  name: string;
  shortName: string;
  id: string;
  description: string;
  users?: string[];
  allowsMedia: boolean;
}

export function convertServerRoomData (roomData: {
  [roomId: string]: Server.Room;
}): { [roomId: string]: Room } {
  const newObj = {}

  Object.keys(roomData).forEach((k) => {
    const room = roomData[k]
    newObj[k] = {
      name: room.displayName,
      id: room.id,
      shortName: room.shortName,
      description: room.description,
      allowsMedia: room.allowsMedia
    }
  })

  return newObj
}
