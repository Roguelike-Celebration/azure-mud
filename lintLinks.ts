import allowedItems from './server/src/allowedItems'
import { includes } from 'lodash'
import { linkActions } from './src/linkActions'
import { staticRoomData } from './server/src/rooms'

const failures: string[][] = []
Object.values(staticRoomData).forEach(async (room) => {
  let { description } = room

  // eslint-disable-next-line no-useless-escape
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
  const simpleLinkRegex = /\[\[(.+?)\]\]/g

  // This used to be using Redis.getRoomIds()
  // Some thinking is needed to figure out whether we should be using disk or redis
  // (Em 8/14/22)
  const roomIds = Object.keys(staticRoomData)

  // These should use regex matching functions instead of replacing
  // but shrug, copy/pasting from RoomView.tsx is fine.
  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    if (includes(roomIds, roomId)) {
    } else if (roomId === 'item' && allowedItems.includes(text)) {
    } else if (linkActions[roomId]) {
    } else {
      failures.push([room.id, match])
    }
    return 'handled'
  })

  description = description.replace(simpleLinkRegex, (match, roomId, _) => {
    if (!includes(roomIds, roomId)) {
      failures.push([room.id, match])
    }
    return 'handled'
  })
})

if (failures.length === 0) {
  process.exit(0)
} else {
  console.log('Some rooms failed validation!')
  failures.forEach(f => {
    console.log(`${f[0]}: ${f[1]}`)
  })

  process.exit(1)
}
