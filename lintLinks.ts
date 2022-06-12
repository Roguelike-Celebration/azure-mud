import { staticRoomData } from './server/src/rooms'
import { linkActions } from './src/linkActions'
import allowedItems from './server/src/allowedItems'
import Redis from './server/src/redis'
import { includes } from 'lodash'

const failures = []
Object.values(staticRoomData).forEach(async (room) => {
  let { description } = room

  // eslint-disable-next-line no-useless-escape
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
  const simpleLinkRegex = /\[\[(.+?)\]\]/g

  // These should use regex matching functions instead of replacing
  // but shrug, copy/pasting from RoomView.tsx is fine.

  const roomIds = await Redis.getRoomIds()

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
