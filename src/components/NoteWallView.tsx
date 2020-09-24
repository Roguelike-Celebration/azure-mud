import React from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { addNoteToWall } from '../networking'
import { NoteView } from './NoteView'

import '../../style/noteWall.css'
import { NoteWallData } from '../../server/src/room'

export function NoteWallView (props: {notes: RoomNote[], noteWallData?: NoteWallData}) {
  const addNote = () => {
    const promptText = props.noteWallData ? props.noteWallData.addNotePrompt : 'What do you type on the note wall?'
    const message = prompt(promptText)
    addNoteToWall(message)
  }

  const sortedNotes = (props.notes || []).sort((a, b) => {
    const aLikes = a.likes ? a.likes.length : 0
    const bLikes = b.likes ? b.likes.length : 0
    return bLikes - aLikes
  })

  const noteViews = sortedNotes.map(n => <NoteView key={n.id} note={n} />)

  const description = props.noteWallData ? props.noteWallData.noteWallDescription :
    'You are looking at a wall with space for people to place sticky notes.'
  const buttonText = props.noteWallData ? props.noteWallData.addNoteLinkText : 'add a note'

  return (
    <div>
      <div className='note-wall-description'>
        {description}
        <br/><br/>
        If you&apos;d like, you can <button onClick={addNote} id='addNote' className='link-styled-button'>{buttonText}</button>.
      </div>
      {noteViews}
    </div>
  )
}
