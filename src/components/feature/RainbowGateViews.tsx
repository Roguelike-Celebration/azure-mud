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
    <p><button id="rainbow-gate-button" className='link-styled-button' onClick={jumpThroughGate}>Splash in the fountain?</button>.</p>
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
        <p>It&apos;s just as satisfying as you always imagined to hop over the lip of the fountain and let the spray engulf you. You could swear you hear brief rhythmic clapping over the mall&apos;s speakers and the start of an upbeat pop song.</p>
        <p>Kicking your feet and letting loose, you become drenched head to toe in the colourful waters. You wipe your face and see a dwarven guard trying to get your attention, the clapping in fact being the clacking of their metal flashlight against the fountain.</p>
        <p>You can&apos;t hear what they&apos;re saying over the spray of the water but you do seem them pointing insistently at a small yellow sign reading &quot;No Splashing.&quot; It&apos;s not exactly fun to just stand still in the middle of this thing, so you wade back to the edge and hop out.</p>
        <p><em>Dyed water drips off you in tiny streams. Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>Studiously looking anywhere but at the cautionary sign, you hop back into the fountain. The dwarven guard looks more exasperated than angry and doesn&apos;t seem inclined to stop you, though their aura of disappointment makes the experience less carefree than the first time.</p>
        <p>Once you&apos;ve had your fill you hop back out, with a fresh coat of watery paint.</p>
        <p><em>Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  }
}
