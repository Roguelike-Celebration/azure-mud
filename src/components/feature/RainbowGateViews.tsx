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
    <p><button id="rainbow-gate-button" className='link-styled-button' onClick={jumpThroughGate}>Get a tattoo?</button></p>
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

  // Removing the logic for counting visits right now, since it's odd when it carries over between years
  // if (visits === 1) {
  return (
    <div>
      <p>You sit down in the chair as a goblin artist fires up their device. It appears to be some kind of handheld machine shaped as if it should hold needles, but in place of that are glowing gemstones. As the tattoo artist hits the switch to activate their device, the glow burns brightly and your body resonates in kind, a slight tingling sensation rippling in its wake.</p>
      <p>The tingling sensation begins to spread across your arm, your torso, and eventually covers all of you despite minimal movement from the goblin. When that is finished, a muscular goblin walks up and begins to massage your shoulder with the flowery lotion you saw before. Relaxation spreads through you entirely. </p>
      <p>You wake up a few moments later at the gentle urgings of the artist, and look down to find yourself glowing an exciting new hue! Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></p>
    </div>
  )
  /* } else {
    return (
      <div>
        <p>Studiously looking anywhere but at the cautionary sign, you hop back into the fountain. The dwarven guard looks more exasperated than angry and doesn&apos;t seem inclined to stop you, though their aura of disappointment makes the experience less carefree than the first time.</p>
        <p>Once you&apos;ve had your fill you hop back out, with a fresh coat of watery paint.</p>
        <p><em>Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></em>.</p>
      </div>
    )
  } */
}
