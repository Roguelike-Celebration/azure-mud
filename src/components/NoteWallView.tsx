import React, { useContext } from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { addNoteToWall } from '../networking'
import { NoteView } from './NoteView'

export function NoteWallView (props: {notes: RoomNote[]}) {
  const addNote = () => {
    const message = prompt('What do you type on the note wall?')
    addNoteToWall(message)
  }

  return (
    <div>
        I am a note wall!
      <button onClick={addNote}>Add new Note</button>
      {props.notes && props.notes.map(n => <NoteView key={n.id} note={n} />) }
    </div>
  )
}
