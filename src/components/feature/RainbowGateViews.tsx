import React from 'react'
import { DispatchContext } from '../../App'
import { ValidColors } from '../../../server/src/types'
import { UpdateProfileColorAction, ShowModalAction } from '../../Actions'
import { Modal } from '../../modals'

// When you pass through the ranbow door enough times, you get a randomly colored username
export const RainbowGateRoomView = () => {
  function randomEnum<T> (anEnum: T): T[keyof T] {
    const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex]
  }

  const dispatch = React.useContext(DispatchContext)

  const jumpThroughGate = () => {
    const visits = parseInt(localStorage.getItem('FeatureRainbowGateVisited')) || 0
    const newVisits = visits + 1
    localStorage.setItem('FeatureRainbowGateVisited', newVisits.toString())
    if (newVisits > 3) {
      dispatch(UpdateProfileColorAction(randomEnum(ValidColors)))
    }

    dispatch(ShowModalAction(Modal.FeatureRainbowGate))
  }

  return <div id="rainbow-gate-div" className="feature-room-view">
    <p>There&apos;s an ornate stone gate, through which you see a many-colored maelstrom. In front of the gate is a
      sloppily-written wooden sign. It reads &quot;Please do not jump through the gate.&quot;
    </p>
    <button id="rainbow-gate-button" onClick={jumpThroughGate}>Jump through the gate!</button>
  </div>
}

export default function RainbowGateModalView () {
  const visits = parseInt(localStorage.getItem('FeatureRainbowGateVisited'))
  if (visits === 1) {
    return (
      <div>
        <h1>You experience something truly wonderful.</h1>
        <p>You leap through the gate, and immediately your senses are overwhelmed with the colors and, uh. The, uh, colors of
          the...unimaginable! It is a truly mindbending experience. You can feel indigo and smell purple, which, okay, yes, I&apos;ve
          heard of synesthesia before, yes, no, no, I&apos;m aware.</p>
        <p>Look, Jessie, I told you, I&apos;m a doctor, not a writer.</p>
        <p>Okay there&apos;s a reason why I put that sign up, we&apos;ll just have to deal with these fine folk coming through here until
          the portal repair guy comes Monday and then -
        </p>
        <p>Yes, yes, okay, look, thanks for visiting, sorry we&apos;re a little bit busy, would you mind just closing the window and
          being on your way? Yes, thank you. We appreciate it.</p>
      </div>
    )
  } else if (visits === 2) {
    return (
      <div>
        <h1>Oh it&apos;s you again.</h1>
        <p>Oh, hey, not to be, uh, not to be touchy or anything but we&apos;d appreciate it if you stopped portaling through our
          living room. You might not notice but uh, you&apos;re kind of leaving an ectoplasmic wake as you pass through which is
          going to be really annoying to clean up, so...we would really appreciate if you stopped.
        </p>
      </div>
    )
  } else if (visits === 3) {
    return (
      <div>
        <h1>Please stop it.</h1>
        <p>No, seriously. I&apos;ve asked you politely and Jessie is getting very cross. If you come back through there will be Consequences.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Okay, that&apos;s enough.</h1>
        <p>You won&apos;t listen. You&apos;ve been asked repeatedly not to, and you won&apos;t listen. I&apos;m breaking out the curses now and
          you&apos;ve nobody to blame but yourself.</p>
      </div>
    )
  }
}
