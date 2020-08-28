/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useContext } from 'react'
import { Room } from '../../room'
import { moveToRoom } from '../../networking'
import { HideModalAction } from '../../Actions'
import { DispatchContext } from '../../App'

/**
 * This procedurally generates a room in the ASCII map!
 *
 * Right now, it's just munging a string together, which makes it difficult for
 * us to do things like coloring elements or making the room name bold
 * (and placing the player's @ is going to be super weird).
 *
 * I also imagine this could be made more complex to procedurally generate
 * other interesting objects in the room (or visualize how many players are in there?)
 */

interface Props {
    width: number
    height: number
    x: number
    y: number
    room: Room
}

export default function MapRoom (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { room, width, height, x, y } = props

  const onClick = () => {
    moveToRoom(room.id)
    dispatch(HideModalAction())
  }

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

  // This fails a bunch of a11y checks. This is okay because I'm assuming the entire map is fundamentally not accessible.
  // We'll offer the old list view as the accessible fallback.
  return <pre onClick={onClick} style={{ position: 'absolute', top: `${y * 15}px`, left: `${x * 10}px`, margin: '0', cursor: 'pointer' }}>{str}</pre>
}
