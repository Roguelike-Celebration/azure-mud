import React from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { addNoteToWall } from '../networking'
import { NoteView } from './NoteView'

import '../../style/noteWall.css'

export function NoteWallView (props: {notes: RoomNote[]}) {
  const addNote = () => {
    const message = prompt('What do you type on the note wall?')
    addNoteToWall(message)
  }

  const sortedNotes = (props.notes || []).sort((a, b) => {
    const aLikes = a.likes ? a.likes.length : 0
    const bLikes = b.likes ? b.likes.length : 0
    return bLikes - aLikes
  })

  const noteViews = sortedNotes.map(n => <NoteView key={n.id} note={n} />)

  return (
    <div>
      <div className='note-wall-description'>
      You are looking at a wall with space for people to place sticky notes.
        <br/><br/>
        If you&apos;d like, you can <button onClick={addNote} id='addNote' className='link-styled-button'>add a note</button>.
      </div>
      {noteViews}
    </div>
  )
}
