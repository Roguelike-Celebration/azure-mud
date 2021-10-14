import React, { useContext, useEffect, useState } from 'react'
import { DispatchContext, UserMapContext } from '../../App'
import { ValidColors } from '../../../server/src/types'
import { UpdateProfileColorAction, ShowModalAction } from '../../Actions'
import { Modal } from '../../modals'
import { getGateVisits, incrementGateVisits } from '../../storage'

// When you pass through the ranbow door enough times, you get a randomly colored username
export const RainbowGateRoomView = () => {
  function randomEnum<T> (anEnum: T): T[keyof T] {
    const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex]
  }

  const dispatch = React.useContext(DispatchContext)

  const jumpThroughGate = async () => {
    const newVisits = await incrementGateVisits()
    dispatch(UpdateProfileColorAction(randomEnum(ValidColors)))
    dispatch(ShowModalAction(Modal.FeatureRainbowGate))
  }

  return <div id="rainbow-gate-div" className="feature-room-view">
    <p>Do you, in fact, approach the chair? <button id="rainbow-gate-button" className='link-styled-button' onClick={jumpThroughGate}>Approach the chair.</button></p>
  </div>
}

export default function RainbowGateModalView () {
  const { userMap, myId } = useContext(UserMapContext)

  const [visits, setVisits] = useState(0)

  useEffect(() => {
    (async () => {
      setVisits(await getGateVisits())
    })()
  }, [])

  if (visits === 1) {
    return (
      <div>
        <h1>It&apos;s a miracle of modern science!</h1>
        <p>&quot;Oho! Why, you&apos;ve arrived just in time for the most amazing experience you&apos;ll ever... experience! Just sit in this chair, pull that lever, and you&apos;ll in for a truly eye-opening journey. Why, it&apos;s a miracle of modern science!&quot;</p>
        <p>You sit in the chair (it&apos;s not especially comfortable and it&apos;s... slightly wet?) and pull the lever. There&apos;s a shudder as the machine rumbles to life and things start happening. Gears spin, lightning arcs up two metal trusses you hadn&apos;t noticed. Your hair begins to stand on end. The doctor (you didn&apos;t see any diplomas, so who&apos;s to say?) starts to cackle wildly, yelling, &quot;It works! It WORKS!&quot; to no one in particular. The machine&apos;s hum hits a crescendo when suddenly everything comes to a stop. All is silence. You wait for a moment when you hear a buzz above you.</p>
        <p>Looking up, you see a mechanical arm holding a bucket extend out and rotate, spilling a bucket of paint all over you. &quot;Yes!&quot; yells the doctor (?) &quot;They said it couldn&apos;t be done! Now... if you&apos;ll excuse me, I need to clean the paint off the chair.&quot; They hold up a sponge and bucket of water and gesture at you to make yourself scarce.</p>
        <p><em>Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Back for more?</h1>
        <p>The ambiguously credentialed operator gives you a nod. &quot;Back for more, huh? Er, wait, no. I mean... *ahem* So! You&apos;ve returned for another glimpse at the uncanny realities beyond human perception! Well sit right down and pull yon lever, my friend.&quot; They floridly gesture to the chair at the center of the paint-dumping apparatus.</p>
        <p>You pull the lever and nothing appears to happen. Then the machine operator runs up with a bucket of paint and spills it all over you. &quot;So sorry, we only have the aetheric budget to do the big show once per person. Grant writing, am I right?&quot; They look you over. &quot;You know, you don&apos;t look that different to me, but what do I know?&quot; They tap the multi-lensed googles obscuring most of their face. &quot;With these things on it&apos;s a wonder I can see at all. Everything is coming through like an original Game Boy screen.&quot;</p>
        <p><em>Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  }
}
