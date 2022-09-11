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
    <p>Sit and pull a rope? <br/> <button id="rainbow-gate-button" className='link-styled-button' onClick={jumpThroughGate}>Pull the paint-spattered rope</button>.</p>
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
        <p>Doctor Hope looms over you with a smile. &quot;You wish to help in my experiments? Just sit in this chair, pull that rope, and you&apos;ll in for a truly eye-opening journey. Why, it&apos;s a miracle of modern science!&quot;</p>
        <p>You sit in the chair (it&apos;s not especially comfortable and it&apos;s ... slightly wet?) and pull the rope. A roar of machinery echoes through the air as gears spin, and lightning arcs up two metal trusses you hadn&apos;t noticed. The doctor starts to cackle wildly, yelling, &quot;It works! It WORKS!&quot; to no one in particular. The machine&apos;s hum hits a crescendo when suddenly everything comes to a stop. Silence. A bucket of paint falls unceremoniously from the ceiling, landing on you.</p>
        <p><em>Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>The ambiguously credentialed doctor gives you a nod. &quot;Back for more? <br/> I appreciate a fellow lover of science!&quot;</p>
        <p>You sit in the damp, uncomfortable chair, and pull the rope. You have just enough time to notice that the rope was attached directly to the bucket this time around. It lands on you with a loud squelching noise.</p>
        <p><em>Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  }
}
