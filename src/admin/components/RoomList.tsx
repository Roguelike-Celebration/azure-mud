/* eslint-disable react/display-name */
import _ from 'lodash'
import React, { useContext } from 'react'

import { DispatchContext } from './App'
import { getRoom } from '../../networking'
import { UpdateAndShowRoomAction } from '../actions'

export default function (props: {roomIds: string[]}) {
  const dispatch = useContext(DispatchContext)

  const roomIds = _.sortBy(props.roomIds || [])

  const onClick = async (e) => {
    const roomId = e.target && e.target.getAttribute && e.target.getAttribute('data-room')
    if (roomId) {
      // TODO: This is bad compared to handling this async better
      // The cobbler's children have no shoes.
      const roomData = await getRoom(roomId)
      console.log('got room data', roomId, roomData)
      dispatch(UpdateAndShowRoomAction(roomId, roomData))
    }
  }

  return (
    <ul>
      {roomIds.map(id => {
        return (
          <li key={`room-button-${id}`}>
            <button
              data-room={id}
              className='nav-item'
              onClick={onClick}
            >
              {id}
            </button>
          </li>)
      })}
    </ul>
  )
}
