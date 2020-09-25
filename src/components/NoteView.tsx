import React, { useContext } from 'react'
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Linkify from 'react-linkify'

import { RoomNote } from '../../server/src/roomNote'
import { UserMapContext } from '../App'
import { MinimalUser } from '../../server/src/user'
import { deleteRoomNote, unlikeRoomNote, likeRoomNote } from '../networking'
import NameView from './NameView'

export function NoteView (props: { note: RoomNote }) {
  const { userMap, myId } = useContext(UserMapContext)
  const n = props.note

  const me: MinimalUser = userMap[myId]
  const canDelete = me.isMod || n.authorId === myId
  const canLike = n.authorId !== myId

  const onClickDelete = () => {
    if (confirm('Are you sure you would like to delete this?')) {
      deleteRoomNote(n.id)
    }
  }

  const hasLiked = n.likes && n.likes.includes(myId)
  const likes = n.likes ? n.likes.length : 0
  let likeNames

  if (hasLiked) {
    likeNames = n.likes.map(l => userMap[l].username).join(', ')
  }

  const onClickLike = () => {
    if (hasLiked) {
      unlikeRoomNote(n.id)
    } else {
      likeRoomNote(n.id)
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
        {canLike
          ? <button className={`link-styled-button like-button ${hasLiked ? 'liked' : 'unliked'}`} onClick={onClickLike} data-tip={likeNames}>
            {likes}{hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
            <ReactTooltip />
          </button>
          : ''}
        -<NameView userId={n.authorId} id={`noteAuthor-${n.id}`}/> <br/>
      </div>
    </Linkify>
  )
}
