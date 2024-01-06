import React, { useContext } from 'react'
import { FaVideo } from 'react-icons/fa'
import { UserMapContext } from '../App'
import { moveToRoom } from '../networking'

import { Room } from '../room'

interface Props {
    rooms: Room[]
}

export default function RoomListView (props: Props) {
  const { userMap, myId } = useContext(UserMapContext)

  const list = props.rooms
    .sort((a, b) => a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1 : -1)
    .map((r) => {
      return (r.hidden && !userMap[myId].isMod) ? '' : <RoomListItem room={r} key={`room-sidebar-${r.id}`} />
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
  // Leaving this in in case we eventually get Zoom support
  //const videoIcon = room.videoUsers && room.videoUsers.length > 0 ? <FaVideo /> : ''

  return (
    <li style={{ listStyle: 'none' }}>
      <button onClick={onClick} className="link-styled-button">
        <strong>{room.hidden ? '(hidden) ' : ''}{room.displayName}</strong> {userCount} {/*videoIcon*/}
      </button>
    </li>
  )
}
