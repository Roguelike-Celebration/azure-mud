import React, { useContext, useEffect } from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { ServerSettings } from '../../server/src/types'
import { addNoteToObelisk, addNoteToWall, deleteRoomNote, startObservingObelisk, stopObservingObelisk, updateServerSettings } from '../networking'
import { NoteView } from './NoteView'
import ReactTooltip from 'react-tooltip'
import { UserMapContext } from '../App'
import { Room } from '../room'

import '../../style/noteWall.css'
import { NoteWallData } from '../../server/src/rooms'
import { PublicUser } from '../../server/src/user'
import { sortBy } from 'lodash'

function numLikes (roomNote: RoomNote) {
  return !roomNote.likes ? 0 : roomNote.likes.length
}

interface Props {
  notes: RoomNote[],
  user: PublicUser,
  // serverSettings: ServerSettings,
}

export function ObeliskView (props: Props) {
  const { userMap } = useContext(UserMapContext)

  // Should run startObservingObelisk on mount and stopObservingObelisk on unmount
  useEffect(() => {
    startObservingObelisk()
    return () => {
      stopObservingObelisk()
    }
  }, [])

  const addNote = () => {
    const promptText = 'What would you like to link to?'
    const message = prompt(promptText)
    addNoteToObelisk(message)
  }

  const saveNotes = async () => {
    interface ExportedNote {
      authorId: string,
      authorName: string
    }

    const mappedNotes = props.notes.map((v) => {
      return {
        id: v.id,
        message: v.message,
        authorId: v.authorId,
        authorUsername: userMap[v.authorId]?.username,
        likes: v.likes?.map((likerId) => {
          return {
            likerId: likerId,
            likerName: userMap[likerId]?.username
          }
        })
      }
    })
    const notesJSON = JSON.stringify(mappedNotes, null, 2)
    const fileName = 'notes-obelisk-' + new Date().toISOString() + '.json'

    // via https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
    var a = document.createElement('a')
    var file = new Blob([notesJSON], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
  }

  const deleteAllNotes = () => {
    const confirmation = confirm('Are you sure you want to delete all notes?')
    if (confirmation) {
      props.notes.map((note) => deleteRoomNote(note.id))
    }
  }

  const sortedNotes = sortBy(props.notes || [], (note) => {
    // Lodash sortBy is always ascending, so we negative it out to get descending
    return note.likes ? -note.likes.length : 0
  })

  const noteViews = sortedNotes.map(n => <NoteView key={n.id} note={n} isObelisk={true} />)

  const saveButton = props.user && props.user.isMod ? (
    <button onClick={saveNotes}>Mod: Download notes to disk</button>
  ) : (
    ''
  )

  const massDeleteButton = props.user && props.user.isMod ? (
    <button onClick={deleteAllNotes}>Mod: Delete all notes</button>
  ) : (
    ''
  )

  return (
    <div>
      <ReactTooltip />
      {saveButton}
      {massDeleteButton}
      <div className='note-wall-description'>
        Much wisdom is collected here. You are compelled to share your own contributions of links to slides, videos, and articles of interest.
        <br/><br/>
        If you&apos;d like, you can <button onClick={addNote} id='addNote' className='link-styled-button'>inscribe the obelisk</button>.
      </div>
      {noteViews}
    </div>
  )
}
