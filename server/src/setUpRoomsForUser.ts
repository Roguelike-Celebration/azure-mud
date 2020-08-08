import { roomData } from './room'

/** This returns an array of SignalRGroupActions that remove the given user
 * from all room-specific SignalR groups other than the specified one. */
export default (userId: string, exclude?: string) => {
  let allRooms = Object.keys(roomData)
  if (exclude) {
    allRooms = allRooms.filter((k) => k !== exclude)
  }
  return allRooms.map((r) => {
    return {
      userId,
      groupName: r,
      action: 'remove'
    }
  })
}
