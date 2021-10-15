import React, { useContext } from 'react'

import { UserMapContext } from '../App'
import { dropItem } from '../networking'

const HeldItemView = () => {
  const { userMap, myId } = useContext(UserMapContext)
  const user = userMap[myId]

  const dropHeldItem = () => {
    dropItem()
  }

  if (user.item) {
    return (
      <span>
        You are holding {user.item}.{' '}
        <button className="link-styled-button" onClick={dropHeldItem}>
          Drop it
        </button>
        .
      </span>
    )
  } else {
    return null
  }
}

export default HeldItemView
