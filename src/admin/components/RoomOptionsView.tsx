/* eslint-disable react/display-name */
import _ from 'lodash'
import React from 'react'

import { deleteRoom } from '../../networking'

export default function (props: {roomId: string, updateRoom: () => void, createRoom: (name: string) => void}) {
  const clickedNew = async () => {
    const name = prompt('What would you like the room to be called?')
    if (!name) return
    await props.createRoom(name)
  }

  const clickedDelete = async () => {
    if (!confirm('Are you SURE you want to delete this? This will delete it from the server memory, and you will only be able to restore it if it is saved on disk.')) return

    await deleteRoom(props.roomId)
    // TODO: Remove roomId from local list
  }

  const clickedSave = () => {
    props.updateRoom()
  }

  return (
    <div id='room-options-view'>
      <button
        onClick={clickedNew}>
        Create
      </button>
      <button
        onClick={clickedDelete}>
        Delete
      </button>
      <button
        onClick={clickedSave}>
        Save
      </button>
    </div>
  )
}
