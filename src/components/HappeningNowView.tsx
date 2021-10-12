import React, { useContext } from 'react'
import { roomData } from '../../server/src/rooms'
import { HappeningNowEntry } from '../../server/src/types'
import { HideModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { moveToRoom } from '../networking'
import { Room } from '../room'
import { ScheduleEntries } from './ScheduleView'

// Apparently reverse() does an actual reversal! WELL. All right then, Javascript.
const ReversedScheduleEntries = [...ScheduleEntries].reverse()

export default function HappeningNowView (props: { roomData: { [roomId: string]: Room }, entries: HappeningNowEntry[] }) {
  const dispatch = useContext(DispatchContext)

  // To test this functionality, just set it at some appropriate date in the conference time
  // const now = new Date(`2020-10-03T18:45:00.000-07:00`)
  const now = new Date()
  const currentlyScheduled = ReversedScheduleEntries.find((entry) => entry.time < now)

  const moveAndClose = (roomId: string) => {
    if (!roomData[roomId]) {
      console.error('Can\'t go to room ' + roomId + ' from link in happening now view, no such room!')
    } else {
      moveToRoom(roomId)
      dispatch(HideModalAction())
    }
  }

  const buildScheduledRoomList = (roomIds: string[]) => {
    return <ul>
      {roomIds.map((id) => {
        return <li key={id}>
          <button id={`button-happening-now${id}`} onClick={() => moveAndClose(id)} className='link-styled-button'>
            {props.roomData[id] ? props.roomData[id].name : 'unknown room'}
          </button>
        </li>
      })}
    </ul>
  }

  let currentlyScheduledElement
  if (currentlyScheduled) {
    currentlyScheduledElement = <div id ='currently-scheduled-div'>
      {currentlyScheduled.text}
      {currentlyScheduled.roomIds ? buildScheduledRoomList(currentlyScheduled.roomIds) : ''}
    </div>
  } else {
    currentlyScheduledElement = <strong>You&apos;re in early! Check the schedule for when the doors officially open.</strong>
  }

  return (
    <div id='happening-now'>
      <h1>Happening Now</h1>
      <h2>From The Schedule</h2>
      {currentlyScheduledElement}
      <h2>Other Live Activities</h2>
      <ul>
        {
          props.entries.map((e) => {
            if (e.roomId) {
              return <li key={e.text}>
                <button id={`button-${e.text}`} onClick={() => moveAndClose(e.roomId)} className='link-styled-button'>{e.text}</button>
              </li>
            } else if (e.externalLink) {
              return <li key={e.text}>
                <a className='nav-item' href={e.externalLink} target='_blank' rel='nofollow noopener noreferrer'>{e.text}</a>
              </li>
            } else {
              return <li key={e.text}>{e.text}</li>
            }
          })
        }
      </ul>
    </div>
  )
}
