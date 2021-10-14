import React from 'react'
import { FaVideo } from 'react-icons/fa'
import { UserMapContext } from '../App'
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
  videoUsers: string[];
  roomId: string;
}) => {
  const { userMap, myId } = React.useContext(UserMapContext)
  let { users, userId, videoUsers } = props

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

    if (props.roomId === 'theater') {
      return (
        <div id="dynamic-room-description">
          There are {users.length} other people sitting in here.
        </div>
      )
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
          {videoUsers && videoUsers.includes(u) ? <FaVideo /> : null}
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
        Also here {users.length === 1 ? 'is' : 'are'} {names}. <HeldItemView />
      </div>
    )
  } else {
    return <div id="dynamic-room-description" />
  }
}

export default PresenceView
