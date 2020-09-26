import React from 'react'
import { FaVideo } from 'react-icons/fa'

import { moveToRoom } from '../networking'
import { Room } from '../room'

export default function RoomNameView (props: { room: Room }) {
  const { room } = props

  const onClick = () => {
    moveToRoom(room.id)
  }
  const userCount = room.users ? `(${room.users.length})` : ''
  const videoIcon = room.videoUsers && room.videoUsers.length > 0 ? <FaVideo /> : ''

  return (
    <button onClick={onClick}>
      <strong>{room.name}</strong> {userCount} {videoIcon}
    </button>
  )
}
