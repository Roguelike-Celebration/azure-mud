import React, { useContext } from "react"
import { HappeningNowEntry } from "../../server/src/types"
import { HideModalAction } from "../Actions"
import { DispatchContext } from "../App"
import { moveToRoom } from "../networking"
import { Room } from "../room"
import { ScheduleEntries } from "./ScheduleView"

// Apparently reverse() does an actual reversal! WELL. All right then, Javascript.
const ReversedScheduleEntries = [...ScheduleEntries].reverse()

export default function HappeningNowView (props: { roomData: { [roomId: string]: Room }, entries: HappeningNowEntry[] }) {
  const dispatch = useContext(DispatchContext)

  const now = new Date(`2020-10-03T18:45:00.000-07:00`)
  // const now = new Date()
  const currentlyScheduled = ReversedScheduleEntries.find((entry) => entry.time < now)

  const moveAndClose = (roomId: string) => {
      moveToRoom(roomId)
      dispatch(HideModalAction())
  }

  return (
    <div id='happening-now'>
      <h1>Happening Now</h1>
      <h2>From The Schedule</h2>
      { currentlyScheduled ?
        <div id ='currently-scheduled-div'>
          {currentlyScheduled.text}
          {currentlyScheduled.roomIds ?
            <ul>{currentlyScheduled.roomIds.map((id) => {
            return <li key={id}><a className='nav-item' href='#' onClick={() => moveAndClose(id)}>{props.roomData[id].name}</a></li>
          })}</ul> : ''}
        </div> :
        <strong>You're in early! Check the schedule for when the doors officially open.</strong>
        }
      <h2>Live From Here</h2>
      <ul>
      {
        props.entries.map((e) => {
          if (e.roomId) {
            return <li key={e.text}><a className='nav-item' href='#' onClick={() => moveAndClose(e.roomId)}>{e.text}</a></li>
          } else if (e.externalLink) {
            return <li key={e.text}><a className='nav-item' href={e.externalLink} target='_blank' rel='nofollow noopener noreferrer'>{e.text}</a></li>
          } else {
            return <li key={e.text}>{e.text}</li>
          }
        })
      }
      </ul>
    </div>
  )
}