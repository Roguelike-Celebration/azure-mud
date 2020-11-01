import { roomData } from './rooms'
import { GroupManagementTask } from './endpoint'

/** This returns an array of SignalRGroupActions that remove the given user
 * from all room-specific SignalR groups other than the specified one. */
export default (userId: string, exclude?: string): GroupManagementTask[] => {
  let allRooms = Object.keys(roomData)
  if (exclude) {
    allRooms = allRooms.filter((k) => k !== exclude)
  }
  return allRooms.map((r): GroupManagementTask => {
    return {
      userId,
      groupId: r,
      action: 'remove'
    }
  })
}
