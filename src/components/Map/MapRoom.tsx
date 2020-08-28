import React from 'react'
import { Room } from '../../room'

interface Props {
    width: number
    height: number
    x: number
    y: number
    room: Room
}

export default function MapRoom (props: Props) {
  const { room, width, height, x, y } = props

  let str

  // Top row
  str = '┌'
  for (let i = 0; i < width; i++) {
    str += '─'
  }
  str += '┐\r\n'

  const nameWords = room.name.split(' ').concat([`(${room.users ? room.users.length : 0})`])
  const rowDiff = (height - nameWords.length) / 2
  const nameVOffset = Math.floor(rowDiff)

  // middle
  for (let row = 0; row < height; row++) {
    str += '│'
    if (row >= nameVOffset && (nameWords.length + nameVOffset) > row) {
      const diff = (width - nameWords[row - nameVOffset].length) / 2
      for (let i = 0; i < Math.floor(diff); i++) {
        str += '.'
      }
      str += nameWords[row - nameVOffset]
      for (let i = 0; i < Math.ceil(diff); i++) {
        str += '.'
      }
    } else {
      for (let col = 0; col < width; col++) {
        str += '.'
      }
    }
    str += '│\r\n'
  }

  // Bottom row
  str += '└'
  for (let i = 0; i < width; i++) {
    str += '─'
  }
  str += '┘\r\n'

  return <pre style={{ position: 'absolute', top: `${y * 15}px`, left: `${x * 10}px`, margin: '0' }}>{str}</pre>
}
