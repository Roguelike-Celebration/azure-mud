import React, { createRef, useContext, useState } from 'react'
import { DispatchContext } from '../App'
import { nowDate, ScheduleEntries } from './ScheduleView'

import '../../style/rateTalks.css'
import { rateTalk } from '../networking'

// For now, we assume that anything with a dedicated breakout room is a talk
const talks = ScheduleEntries.filter(e => e.breakoutRoomId)

interface Props {
  ratedTalks: string[]
}

export default function RateTalksView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const [selectedRating, setSelectedRating] = useState(-1)

  const selectorRef = createRef<HTMLSelectElement>()
  const textRef = createRef<HTMLTextAreaElement>()

  const handleRatingClick = (e) => {
    console.log(e.target, e, e.target.value)
    setSelectedRating(parseInt(e.target.value))
  }

  const selectedTalk = (e) => {
    setSelectedRating(-1)
    textRef.current.value = ''
  }

  const clickSubmit = () => {
    if (selectedRating === -1) {
      alert('Please select a rating between 1 and 5')
      return
    }

    const talk = selectorRef.current.value
    const text = textRef.current.value
    rateTalk(talk, selectedRating, text)
  }

  // This makes it so a talk is visible any time after it starts
  // Ideally we'd wait until after a talk is over, but we don't currently have that
  // (IDEA: before filtering for talks, we could find the current block, then filter talks for all
  // previous ones)
  const now = nowDate()
  const possibleTalks = talks.filter(e => e.time < now)
  const currentTalk = possibleTalks[possibleTalks.length - 1]

  const talkOptions = possibleTalks.map(t => {
    return <option
      value={t.text}
      key={t.text.split(' ').join('-')}
      disabled={props.ratedTalks.includes(t.text)}
    >
      {t.text}
    </option>
  })

  return (
    <div id='rate-talks'>
      <h1>Rate talks</h1>
      <label htmlFor='talk-list' defaultValue={currentTalk.text}>Select a talk</label>
      <select id='talklist' ref={selectorRef} onBlur={selectedTalk}>
        {talkOptions}
      </select>

      <fieldset>
        <legend>How would you rate this talk?</legend>
        {[...Array(5).keys()].map(n => {
          const num = n + 1
          return (
            <span key={`rating-span-${num}`}>
              <label htmlFor={`rating-${num}`}>
                <span role='img' aria-label={`${num} star`}>
                  {'⭐'.repeat(num)}
                </span>
              </label>
              <input
                type='radio'
                id={`rating-${num}`}
                value={num}
                checked={selectedRating === num}
                onChange={handleRatingClick} />
            </span>
          )
        })}
      </fieldset>

      <label htmlFor='feedback'>Is there anything else you'd like to share about this talk?</label><br/>
      <textarea id='feedback' ref={textRef} />

      <br/>
      <button onClick={clickSubmit} id='submit'>Submit</button>
    </div>
  )
}
