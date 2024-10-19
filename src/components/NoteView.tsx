import React, { useContext, useEffect, useState } from 'react'
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Linkify from 'react-linkify'

import { RoomNote } from '../../server/src/roomNote'
import { UserMapContext } from '../App'
import { MinimalUser } from '../../server/src/user'
import { deleteRoomNote, unlikeRoomNote, unlikeObeliskNote, likeRoomNote, likeObeliskNote, deleteObeliskNote, deleteRoom } from '../networking'
import NameView from './NameView'

export function NoteView (props: { note: RoomNote, isObelisk?: boolean }) {
  const { userMap, myId } = useContext(UserMapContext)
  const n = props.note
  ReactTooltip.rebuild()

  const me: MinimalUser = userMap[myId]
  const canDelete = me.isMod || n.authorId === myId
  // const canLike = n.authorId !== myId
  const canLike = true

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

  const linkDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  )

  return (
    <Linkify componentDecorator={linkDecorator}>
      <div className='note'>
        {canDelete ? <button onClick={onClickDelete} className='link-styled-button note-delete'>X</button> : ''}
        {n.message} <br/>
        <div className='note-author'>
        -<NameView userId={n.authorId} id={`noteAuthor-${n.id}`}/>
        </div>
        <div className='note-like-button-container'>
          <button className={`link-styled-button like-button ${hasLiked || !canLike ? 'liked' : 'unliked'}`} onClick={onClickLike} data-tip={hasLiked ? likeNames : ''}>
            {likes}{hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          </button>
        </div>
      </div>
    </Linkify>
  )
}
