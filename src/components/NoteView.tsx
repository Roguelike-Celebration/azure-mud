import React, { useContext } from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { UserMapContext } from '../App'
import { isMod, MinimalUser } from '../../server/src/user'
import { deleteRoomNote } from '../networking'
import NameView from './NameView'

export function NoteView (props: { note: RoomNote }) {
  const { userMap, myId } = useContext(UserMapContext)
  const n = props.note

  const me: MinimalUser = userMap[myId]
  const canDelete = me.isMod || n.authorId === myId

  const onClickDelete = () => {
    if (confirm('Are you sure you would like to delete this?')) {
      deleteRoomNote(n.id)
    }
  }

  return (
    <div>
      {canDelete ? <button onClick={onClickDelete}>X</button> : ''}
      {n.message} <br/>
        -<NameView userId={n.authorId} id={`noteAuthor-${n.id}`}/> <br/>
        ({n.likes && n.likes.length || 0} likes)
    </div>
  )
}
