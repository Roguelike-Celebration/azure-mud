import React from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { ServerSettings, toServerSettings } from '../../server/src/types'
import { addNoteToWall, deleteRoomNote, updateServerSettings } from '../networking'
import { NoteView } from './NoteView'

import '../../style/noteWall.css'
import { NoteWallData } from '../../server/src/rooms'
import { PublicUser } from '../../server/src/user'

// TODO: insanely silly to hardcode these here, since they can easily fall out of sync
// If you're reading this, these are the specific room ids for Roguelike Celebration 2021
// and you should rip them out, probably?
const UNCONFERENCING_ROOM_IDS = ['cockatrice', 'dragon', 'naga', 'skeleton', 'tengu', 'yak']

function numLikes (roomNote: RoomNote) {
  return !roomNote.likes ? 0 : roomNote.likes.length
}

export function NoteWallView (props: {notes: RoomNote[], noteWallData?: NoteWallData, user: PublicUser, serverSettings: ServerSettings}) {
  const addNote = () => {
    const promptText = props.noteWallData ? props.noteWallData.addNotePrompt : 'What do you type on the note wall?'
    const message = prompt(promptText)
    addNoteToWall(message)
  }

  const deleteAllNotes = () => {
    const confirmation = confirm('Are you sure you want to delete all notes?')
    if (confirmation) {
      props.notes.map((note) => deleteRoomNote(note.id))
    }
  }

  const setAsUnconferencingTopics = () => {
    const confirmation = confirm('This will assign the top 6 rooms to the unconferencing rooms, are you sure?')
    if (confirmation && props.notes.length > 0) {
      const settingsCopy: ServerSettings = JSON.parse(JSON.stringify(props.serverSettings))
      const sortedDescending = props.notes.sort((a, b) => numLikes(a) < numLikes(b) ? 1 : -1)
      const newEntries = []
      for (var i = 0; i < Math.min(sortedDescending.length, UNCONFERENCING_ROOM_IDS.length); i++) {
        newEntries.push({
          text: `Unconference: ${sortedDescending[i].message} in the ${UNCONFERENCING_ROOM_IDS[i]} room.`,
          roomId: UNCONFERENCING_ROOM_IDS[i]
        })
      }
      settingsCopy.happeningNowEntries = newEntries.concat(settingsCopy.happeningNowEntries)
      updateServerSettings(settingsCopy)
    }
  }

  const sortedNotes = (props.notes || []).sort((a, b) => {
    const aLikes = a.likes ? a.likes.length : 0
    const bLikes = b.likes ? b.likes.length : 0
    return bLikes - aLikes
  })

  const noteViews = sortedNotes.map(n => <NoteView key={n.id} note={n} />)

  const description = props.noteWallData ? props.noteWallData.noteWallDescription
    : 'You are looking at a wall with space for people to place sticky notes.'
  const buttonText = props.noteWallData ? props.noteWallData.addNoteLinkText : 'add a note'

  const massDeleteButton = props.user && props.user.isMod ? (
    <button onClick={deleteAllNotes}>Mod: Delete all notes</button>
  ) : (
    ''
  )

  const setAsUnconferencingTopicsButton = props.user && props.user.isMod ? (
    <button onClick={setAsUnconferencingTopics}>Mod: Set as unconferencing topics</button>
  ) : (
    ''
  )

  return (
    <div>
      {massDeleteButton}
      {setAsUnconferencingTopicsButton}
      <div className='note-wall-description'>
        {description}
        <br/><br/>
        If you&apos;d like, you can <button onClick={addNote} id='addNote' className='link-styled-button'>{buttonText}</button>.
      </div>
      {noteViews}
    </div>
  )
}
