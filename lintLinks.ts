import { roomData } from './server/src/rooms'
import { linkActions } from './src/linkActions'
import allowedItems from './server/src/allowedItems'

const failures = []
Object.values(roomData).forEach((room) => {
  let { description } = room

  // eslint-disable-next-line no-useless-escape
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
  const simpleLinkRegex = /\[\[(.+?)\]\]/g

  // These should use regex matching functions instead of replacing
  // but shrug, copy/pasting from RoomView.tsx is fine.

  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    if (roomData[roomId]) {
    } else if (roomId === 'item' && allowedItems.includes(text)) {
    } else if (linkActions[roomId]) {
    } else {
      failures.push([room.id, match])
    }
    return 'handled'
  })

  description = description.replace(simpleLinkRegex, (match, roomId, _) => {
    if (!roomData[roomId]) {
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
