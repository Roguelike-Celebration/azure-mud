import React from 'react'
import { Room } from '../room'
import { moveToRoom } from '../networking'
import MenuButtonView from './MenuButtonView'
import { FaVideo } from 'react-icons/fa'

import '../../style/nav.css'

interface Props {
  rooms: Room[];
  username: string;
}

export default function RoomListView(props: Props) {
  return (
    <nav id="side-menu" role="navigation" aria-label="List of rooms you can navigate to">
      <MenuButtonView username={props.username} />
      <ul>
        {props.rooms.map((r) => (
          <RoomListItem room={r} key={`room-sidebar-${r.id}`} />
        ))}
      </ul>
    </nav>
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
    <li>
      <button onClick={onClick}>
        <strong>{room.name}</strong> {userCount} {videoIcon}
      </button>
    </li>
  )
}
