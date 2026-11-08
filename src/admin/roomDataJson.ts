/*
 * Canonical ordering and formatting for roomData.json. So textual diffs of it correspond
 * almost fully to data-model diffs, and there's a uniform format for data files downloaded
 * from the editor or otherwise constructed at run time.
 *
 * The format: Top-level rooms are sorted by ID. Within each room object, the main keys
 * come first in a fixed custom order, and then everything else alphabetically. Nested objects
 * keep their existing ordering without one imposed. The custom ordering of room field
 * keys arranges them in a readable manner like we've typically used in roomData.json.
 */

type RoomMap<T> = { [roomId: string]: T }

/** Format room data in canonical roomData.json file format. */
export function formatRoomDataJson<T extends object> (rooms: RoomMap<T>): string {
  return JSON.stringify(canonicalizeRoomData(rooms), null, 2) + '\n'
}

/** Canonicalize room data, as a new object with ordered keys. */
export function canonicalizeRoomData<T extends object> (rooms: RoomMap<T>): RoomMap<T> {
  const result: RoomMap<T> = {}
  // Plain locale-independent asciibetical sort()
  for (const roomId of Object.keys(rooms).sort()) {
    result[roomId] = canonicalizeRoom(rooms[roomId])
  }
  return result
}

/** Canonicalize a single room's room data. */
function canonicalizeRoom<T extends object> (room: T): T {
  const keys = Object.keys(room)
  const leadingKeys = LEADING_ROOM_KEYS.filter((k) => keys.includes(k))
  const otherKeys = keys.filter((k) => !LEADING_ROOM_KEYS.includes(k)).sort()
  const newKeyOrder = [...leadingKeys, ...otherKeys]
  return Object.fromEntries(newKeyOrder.map((k) => [k, room[k as keyof T]])) as T
}

/** Custom ordering for canonical-ordered room object keys. */
const LEADING_ROOM_KEYS = [
  'displayName',
  'shortName',
  'id',
  'roomId',
  'description',
  'hidden',
  'specialFeatures',
  'specialFeatureText',
  'riddles',
  'hasNoteWall',
  'noteWallData'
]
