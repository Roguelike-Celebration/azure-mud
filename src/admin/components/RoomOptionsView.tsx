/* eslint-disable react/display-name */
import React from 'react'

import { deleteRoom } from '../../networking.js'

export default function (props: { roomId: string | undefined, updateRoom: () => void, createRoom: (name: string) => void }) {
  const clickedNew = () => {
    const name = prompt('What would you like the room to be called?')
    if (!name) return
    props.createRoom(name)
  }

  const clickedDelete = async () => {
    if (!props.roomId) {
      alert('No room selected to delete')
      return
    }
    if (!confirm('Are you SURE you want to delete this? This will delete it from the server ' +
      'memory, and you will only be able to restore it if it is saved on disk. (Will also ' +
      'cause a page refresh)')) {
        return
    }
    const result = await deleteRoom(props.roomId)
    if (!result.ok) {
      alert(`Failed deleting room ${props.roomId}: ${result.error}`)
      return
    }
    alert(`Deleted room ${props.roomId}.`)
    // TODO: Remove roomId from local list in a less silly way
    window.location.reload()
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
