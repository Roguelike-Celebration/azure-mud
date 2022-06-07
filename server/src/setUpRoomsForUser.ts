import { GroupManagementTask } from './endpoint'
import Redis from './redis'

/** This returns an array of SignalRGroupActions that remove the given user
 * from all room-specific SignalR groups other than the specified one. */
export default async (userId: string, exclude?: string): Promise<GroupManagementTask[]> => {
  let allRooms = await Redis.getRoomIds()
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
