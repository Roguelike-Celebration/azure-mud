import React from 'react'
import { FaVideo } from 'react-icons/fa'
import { moveToRoom } from '../networking'

import { Room } from '../room'

interface Props {
    rooms: Room[]
}

export default function RoomListView (props: Props) {
  const list = props.rooms.map((r) => {
    return r.hidden ? '' : <RoomListItem room={r} key={`room-sidebar-${r.id}`} />
  })

  return (
    <div>
      <h1>List of Rooms</h1>
      <ul>
        {list}
      </ul>
    </div>
  )
}

const RoomListItem = (props: { room: Room }) => {
  const { room } = props

  const onClick = () => {
    moveToRoom(room.id)
  }
  const userCount = room.users ? `(${room.users.length})` : ''
  const videoIcon = room.videoUsers && room.videoUsers.length > 0 ? <FaVideo /> : ''

  return (
    <li style={{ listStyle: 'none' }}>
      <button onClick={onClick} className="link-styled-button">
        <strong>{room.displayName}</strong> {userCount} {videoIcon}
      </button>
    </li>
  )
}
