import React, { useContext } from 'react'
import { RoomNote } from '../../server/src/roomNote'
import { ServerSettings } from '../../server/src/types'
import { addNoteToWall, deleteRoomNote, updateServerSettings } from '../networking'
import { NoteView } from './NoteView'
import ReactTooltip from 'react-tooltip'
import { UserMapContext } from '../App'
import { Room } from '../room'

import '../../style/noteWall.css'
import { NoteWallData } from '../../server/src/rooms'
import { PublicUser } from '../../server/src/user'
import { sortBy } from 'lodash'

// TODO: We hardcode room names for the 'auto-assign topics to unconference rooms' feature
// This is silly, and we almost missed this in 2022 AND 2023.
// Take a note to update this for 2024, and consider refactoring (to e.g. an 'unconference' flag in the room data?)
const UNCONFERENCING_ROOM_IDS = ['unconference80s', 'unconferenceDance', 'unconferenceFighterman', 'unconferenceRacing']

function numLikes (roomNote: RoomNote) {
  return !roomNote.likes ? 0 : roomNote.likes.length
}

interface Props {
  roomDisplayName: string,
  notes: RoomNote[],
  noteWallData?: NoteWallData,
  user: PublicUser,
  serverSettings: ServerSettings,
  roomData: { [roomId: string]: Room }
}

export function NoteWallView (props: Props) {
  const { userMap } = useContext(UserMapContext)

  const addNote = () => {
    const promptText = props.noteWallData ? props.noteWallData.addNotePrompt : 'What do you type on the note wall?'
    const message = prompt(promptText)
    addNoteToWall(message)
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
    const fileName = 'notes-' + props.roomDisplayName + '-' + new Date().toISOString() + '.json'

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

  const setAsUnconferencingTopics = () => {
    const confirmation = confirm('This will assign the top N topics to the unconferencing rooms, are you sure?')
    if (confirmation && props.notes.length > 0) {
      const settingsCopy: ServerSettings = JSON.parse(JSON.stringify(props.serverSettings))
      const sortedDescending = [...props.notes].sort((a, b) => numLikes(a) < numLikes(b) ? 1 : -1)
      const newEntries = []
      for (var i = 0; i < Math.min(sortedDescending.length, UNCONFERENCING_ROOM_IDS.length); i++) {
        const { displayName } = props.roomData[UNCONFERENCING_ROOM_IDS[i]]
        newEntries.push({
          text: `Unconference: ${sortedDescending[i].message} in ${displayName}.`,
          roomId: UNCONFERENCING_ROOM_IDS[i]
        })
      }
      settingsCopy.happeningNowEntries = newEntries.concat(settingsCopy.happeningNowEntries)
      updateServerSettings(settingsCopy)
    }
  }

  const sortedNotes = sortBy(props.notes || [], (note) => {
    // Lodash sortBy is always ascending, so we negative it out to get descending
    return note.likes ? -note.likes.length : 0
  })

  const noteViews = sortedNotes.map(n => <NoteView key={n.id} note={n} />)

  const description = props.noteWallData ? props.noteWallData.noteWallDescription
    : 'You are looking at a wall with space for people to place sticky notes.'
  const buttonText = props.noteWallData ? props.noteWallData.addNoteLinkText : 'add a note'

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

  const setAsUnconferencingTopicsButton = props.user && props.user.isMod ? (
    <button onClick={setAsUnconferencingTopics}>Mod: Set as unconferencing topics</button>
  ) : (
    ''
  )

  return (
    <div>
      <ReactTooltip />
      {saveButton}
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
