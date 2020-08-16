import React, { useContext } from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { UserMapContext } from '../App'

export function NoteView (props: { note: RoomNote }) {
  const { userMap } = useContext(UserMapContext)
  const n = props.note

  return (
    <div>
      {n.message} <br/>
        -{userMap[n.authorId].username} <br/>
        ({n.likes && n.likes.length || 0} likes)
    </div>
  )
}
