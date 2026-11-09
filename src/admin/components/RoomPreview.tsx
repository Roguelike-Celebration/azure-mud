import React from 'react'

import { tooltipAttrs } from '../../display.js'
import type { RoomDataMap } from '../../reducer.js'
import { Room } from '../../room.js'
import { defaultRoomWallDescription, findBrokenLinks, parseDescription } from '../../roomDescription.js'

import '../../../style/room.css'

/**
 * Preview of the room being edited, roughly as the main app's RoomView shows it. Uses
 * RoomView's element ids, so room.css styles it the same way. Links and buttons don't
 * work, and interactive special features show as placeholders.
 *
 * This separate RoomPreview implementation is kind of a hack, instead of factoring out
 * some of the room rendering to shareable components. But oh well.
 */
export default function RoomPreview (props: { editorText: string, roomData: RoomDataMap }) {
  if (!props.editorText) {
    return <div id='room-preview' />
  }
  let room: Room
  try {
    room = JSON.parse(props.editorText)
  } catch (e) {
    return (
      <div id='room-preview'>
        <p className='room-preview-note'>Invalid JSON ({String(e)})</p>
      </div>
    )
  }
  if (typeof room !== 'object' || room === null || Array.isArray(room)) {
    return (
      <div id='room-preview'>
        <p className='room-preview-note'>Not a room: the JSON is not an object</p>
      </div>
    )
  }
  // The editor's JSON may not match the Room type, and the parsing needs a description string
  if (typeof room.description !== 'string') {
    room = { ...room, description: '' }
  }
  const brokenLinks = findBrokenLinks(room, props.roomData)

  // TODO: Maybe factor out all the special-feature text to roomDescription.ts.

  return (
    <div id='room-preview'>
      {brokenLinks.length > 0 && (
        <p className='room-preview-note broken-link-count' {...tooltipAttrs(brokenLinks.join('\n'))}>
          !!! {brokenLinks.length} broken link{brokenLinks.length > 1 ? 's' : ''} !!!
        </p>
      )}
      <h1 id='room-name'>{room.displayName}</h1>
      <div id='full-room-description'>
        <div
          id='static-room-description'
          dangerouslySetInnerHTML={{
            __html: parseDescription(room, props.roomData, {}, { checkLinks: true })
          }}
        />
        {room.id === 'theater' && <p className='room-preview-note'>[Stream embed]</p>}
        {room.specialFeatures?.map((feature) => (
          <p key={feature} className='room-preview-note'>[Special feature: {feature}]</p>
        ))}
        {room.riddles && (
          <button disabled>
            {room.riddles.length > 1 ? 'Examine the Riddles' : 'Examine the Riddle'}
          </button>
        )}
        {room.hasNoteWall && (
          <div>
            {room.noteWallData?.roomWallDescription ?? defaultRoomWallDescription}{' '}
            <button disabled>{room.noteWallData?.noteWallButton ?? 'View note wall'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
