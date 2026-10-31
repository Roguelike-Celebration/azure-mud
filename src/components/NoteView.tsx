import Linkify from 'linkify-react'
import React, { useContext } from 'react'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'

import { RoomNote } from '../../server/src/roomNote.js'
import { MinimalUser } from '../../server/src/user.js'
import { UserMapContext } from '../App.js'
import { tooltipAttrs } from '../display.js'
import { linkifyOpts } from '../linkifyOptions.js'
import { deleteObeliskNote, deleteRoomNote, likeObeliskNote, likeRoomNote, unlikeObeliskNote, unlikeRoomNote } from '../networking.js'

import NameView from './NameView.js'

export function NoteView (props: { note: RoomNote, isObelisk?: boolean }) {
  const { userMap, myId } = useContext(UserMapContext)
  const n = props.note

  const me: MinimalUser = userMap[myId]
  const canDelete = me.isMod || n.authorId === myId
  const canLike = n.authorId !== myId

  const onClickDelete = () => {
    if (confirm('Are you sure you would like to delete this?')) {
      const fn = (props.isObelisk ? deleteObeliskNote : deleteRoomNote)
      fn(n.id)
    }
  }

  const likes = n.likes ? n.likes.length : 0
  const hasLiked = n.likes && n.likes.includes(myId)

  const likeNames = n.likes?.map(l => userMap[l].username).join(', ')

  const onClickLike = () => {
    if (!canLike) return
    if (hasLiked) {
      const fn = (props.isObelisk ? unlikeObeliskNote : unlikeRoomNote)
      fn(n.id)
    } else {
      const fn = (props.isObelisk ? likeObeliskNote : likeRoomNote)
      fn(n.id)
    }
  }

  return (
    <Linkify options={linkifyOpts}>
      <div className='note'>
        {canDelete ? <button onClick={onClickDelete} className='link-styled-button note-delete'>X</button> : ''}
        {n.message} <br/>
        <div className='note-author'>
        -<NameView userId={n.authorId} id={`noteAuthor-${n.id}`}/>
        </div>
        <div className='note-like-button-container'>
          <button className={`link-styled-button like-button ${hasLiked || !canLike ? 'liked' : 'unliked'}`} onClick={onClickLike} {...tooltipAttrs(hasLiked && likeNames)}>
            {likes}{hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          </button>
        </div>
      </div>
    </Linkify>
  )
}
