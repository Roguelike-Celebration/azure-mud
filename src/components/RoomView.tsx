import * as React from 'react'
import { Room } from '../room'
import {
  moveToRoom,
  prepareToStartVideoChat,
  getNetworkMediaChatStatus
} from '../networking'
import NameView from './NameView'
import { DispatchContext } from '../App'
import { StopVideoChatAction } from '../Actions'

import '../../style/room.css'
import { NoteWallView } from './NoteWallView'

interface Props {
  room?: Room;
  userId?: string;
}

export default function RoomView (props: Props) {
  const dispatch = React.useContext(DispatchContext)

  const { room } = props

  // This is very silly.
  // Since we're manually setting raw HTML, we can't get refs to add proper click handlers
  // Instead, we just hijack ALL clicks in the description, and check if they're for a link
  const descriptionClick = (e) => {
    const roomId =
      e.target && e.target.getAttribute && e.target.getAttribute('data-room')
    if (roomId) {
      moveToRoom(roomId)
    }
  }

  const joinVideoChat = async () => {
    prepareToStartVideoChat()
  }

  const leaveVideoChat = () => {
    dispatch(StopVideoChatAction())
  }

  const showNoteWall = () => {
    // <NoteWallView notes={room.notes}/>
  }

  let noteWallView
  if (room && room.hasNoteWall) {
    noteWallView = <div>One of the walls has space for attendees to put up sticky notes. <button onClick={showNoteWall}>View note wall</button></div>
  }

  let videoChatButton
  if (room && room.allowsMedia) {
    if (getNetworkMediaChatStatus()) {
      videoChatButton = (
        <button onClick={leaveVideoChat}>
          Leave Video Chat
        </button>
      )
    } else {
      videoChatButton = (
        <button onClick={joinVideoChat}>
          Join Video Chat
        </button>
      )
    }
  }

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div id="room">
      <h1 id="room-name">{room ? room.name : 'Loading...'}</h1>
      <div
        id="static-room-description"
        onClick={descriptionClick}
        dangerouslySetInnerHTML={{
          __html: room
            ? parseDescription(room.description)
            : 'Loading current room...'
        }}
      />
      {room ? <PresenceView users={room.users} userId={props.userId} /> : ''}
      {videoChatButton}
      {noteWallView}
    </div>
  )
}

const PresenceView = (props: { users?: string[]; userId?: string }) => {
  let { users, userId } = props

  // Shep: Issue 43, reminder to myself that this is the code making sure users don't appear in their own client lists.
  if (users && userId) {
    users = users.filter((u) => u !== userId)
  }

  if (users) {
    // TODO: This should happen in the reducer
    let names

    if (users.length === 0) {
      return <div id="dynamic-room-description">You are all alone here.</div>
    }

    const userViews = users.map((u, idx) => {
      const id = `presence-${idx}`
      return <NameView userId={u} id={id} key={id} />
    })

    if (users.length === 1) {
      names = userViews[0]
    } else if (users.length === 2) {
      names = (
        <span>
          {userViews[0]} and {userViews[1]}
        </span>
      )
    } else {
      names = (
        <span>
          {intersperse(userViews.slice(0, users.length - 1), ', ')}, and{' '}
          {userViews[userViews.length - 1]}
        </span>
      )
    }

    return (
      <div id="dynamic-room-description">
        Also here {users.length === 1 ? 'is' : 'are'} {names}.
      </div>
    )
  } else {
    return <div id="dynamic-room-description" />
  }
}

// https://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
function intersperse (arr, sep) {
  if (arr.length === 0) {
    return []
  }

  return arr.slice(1).reduce(
    function (xs, x, i) {
      return xs.concat([sep, x])
    },
    [arr[0]]
  )
}

function parseDescription (description: string): string {
  // eslint-disable-next-line no-useless-escape
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
  const simpleLinkRegex = /\[\[(.+?)\]\]/g

  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    return `<a class='room-link' href='#' data-room='${roomId}'>${text}</a>`
  })

  description = description.replace(simpleLinkRegex, (match, roomId) => {
    return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}</a>`
  })
  return description
}
