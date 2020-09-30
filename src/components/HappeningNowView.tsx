import React from "react"
import { HappeningNowEntry } from "../../server/src/types"
import { moveToRoom } from "../networking"

export default function HappeningNowView (props: { entries: HappeningNowEntry[] }) {
  return (
    <div id='happening-now'>
      <h3>Happening Now</h3>
      {
        props.entries.map((e) => {
          if (e.roomId) {
            return <p><a className='nav-item' href='#' onClick={() => moveToRoom(e.roomId)}>{e.text}</a></p>
          } else if (e.externalLink) {
            return <p><a className='nav-item' href={e.externalLink} target='_blank' rel='nofollow noopener noreferrer'>{e.text}</a></p>
          } else {
            return <p>{e.text}</p>
          }
        })
      }
    </div>
  )
}