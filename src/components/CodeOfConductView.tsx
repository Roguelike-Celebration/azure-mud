import React, { useContext } from 'react'

import '../../style/profileEditView.css'
import { DispatchContext } from '../App'
import { HideModalAction } from '../Actions'

export default function CodeOfConductView () {
  const dispatch = useContext(DispatchContext)

  const close = () => {
    dispatch(HideModalAction())
  }

  return (
    <div>
      <p>Our goal is to have a really fun and welcoming celebration of roguelike games, so we have a formalized code of conduct that sets these expectations.</p>
      <p><a href={ 'https://roguelike.club/code.html' }>Read our full Code of Conduct on our website.</a></p>
      <p>For this event, if you&apos;re being harrassed, notice someone being harrassed, or have any other concerns related to the code of conduct, <strong>you can contact one of this event&apos;s organizers.</strong> These people are currently noted by a crown emoji 👑 next to their name. You can also use the <code>/mod</code> command to privately message all moderators.</p>
    </div>
  )
}
