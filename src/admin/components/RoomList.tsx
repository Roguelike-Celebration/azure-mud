/* eslint-disable react/display-name */
import _ from 'lodash'
import React, { useContext } from 'react'

import { DispatchContext } from './App'
import { getAllRooms, getRoom, resetRoomData } from '../../networking'
import { UpdateAndShowRoomAction } from '../actions'

export default function (props: {roomIds: string[]}) {
  const dispatch = useContext(DispatchContext)

  const roomIds = _.sortBy(props.roomIds || [])

  const clickedResetData = async () => {
    if (!confirm("Are you sure you'd like to reset room data?")) return
    await resetRoomData()
    await getAllRooms()
  }

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
    <ul id='room-list'>
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
      <button
        onClick={clickedResetData}
        style={{ marginTop: '1em' }}>
        Reset Room Data to Disk Copy
      </button>
    </ul>
  )
}
