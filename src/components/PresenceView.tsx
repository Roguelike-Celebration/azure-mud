import React, { useState } from 'react'
import { FaVideo, FaVolumeUp } from 'react-icons/fa'
import { UserMapContext } from '../App'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import HeldItemView from './HeldItemView'
import NameView from './NameView'

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

const PresenceView = (props: {
  users?: string[];
  userId?: string;
  roomId: string;
}) => {
  const { userMap } = React.useContext(UserMapContext)
  let { users, userId } = props
  const { callParticipants } = useMediaChatContext()
  const [summarizeUsersInRoom, setSummarizeUsersInRoom] = useState(false)

  let audioUsers, videoUsers
  if (callParticipants) {
    const mediaUsers = Array.from(callParticipants.values())
    audioUsers = mediaUsers.filter(p => p.audioTracks.size > 0).map(p => p.identity)
    videoUsers = mediaUsers.filter((p) => p.videoTracks.size > 0).map((p) => p.identity)
  }

  // Shep: Issue 43, reminder to myself that this is the code making sure users don't appear in their own client lists.
  if (users && userId) {
    users = users.filter((u) => u !== userId)
  }

  if (users) {
    // TODO: This should happen in the reducer
    let names

    if (users.length === 0) {
      return (
        <div id="dynamic-room-description">
          You are all alone here. <HeldItemView />
        </div>
      )
    }

    const UserSummary = () => {
      return (<span id="dynamic-room-description">
        There are {users.length} other people sitting in here.
      </span>)
    }

    if (props.roomId === 'theater') {
      return (<UserSummary />
      )
    }

    if (summarizeUsersInRoom) {
      return (<div style={{ paddingBottom: '0.5rem' }}>
        <UserSummary /> <button style={{ display: 'inline' }} onClick={() => setSummarizeUsersInRoom(false)}>show them to me</button>
      </div>)
    }

    const userViews = users.map((u, idx) => {
      const user = userMap[u]
      if (!user) {
        return <span />
      }
      const id = `presence-${idx}`
      return (
        <span key={`room-presence-${id}`}>
          <NameView userId={u} id={id} key={id} />
          {audioUsers && audioUsers.includes(user.id) ? (
            <FaVolumeUp className="has-audio" />
          ) : null}
          {videoUsers && videoUsers.includes(user.id) ? (
            <FaVideo className="has-video" />
          ) : null}
          {user.item ? ` (holding ${user.item})` : null}
        </span>
      )
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
        {!summarizeUsersInRoom && <span>Also here {users.length === 1 ? 'is' : 'are'} {names}. <button style={{ display: 'inline-block' }} onClick={() => setSummarizeUsersInRoom(true)}>hide them from me</button> </span>}<HeldItemView />
      </div>
    )
  } else {
    return <div id="dynamic-room-description" />
  }
}

export default PresenceView
