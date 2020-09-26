import React, { useContext } from 'react'
import { FaVideo } from 'react-icons/fa'

import { moveToRoom } from '../networking'
import { RoomDataContext } from '../App'

interface Props {
  roomId: string
  title?: string
}

export default function RoomNameView (props: Props) {
  const { roomData } = useContext(RoomDataContext)
  const room = roomData[props.roomId]
  if (!room) return null

  const onClick = () => {
    moveToRoom(room.id)
  }
  const userCount = room.users ? `(${room.users.length})` : ''
  const videoIcon = room.videoUsers && room.videoUsers.length > 0 ? <FaVideo /> : ''

  return (
    <button onClick={onClick}>
      <strong>{props.title ? props.title : room.name}</strong> {userCount} {videoIcon}
    </button>
  )
}
