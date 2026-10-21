import React, { useContext, useEffect, useState } from 'react'

import { ValidColors } from '../../../server/src/types'
import { ShowModalAction, UpdateProfileColorAction } from '../../Actions'
import { DispatchContext, UserMapContext } from '../../App'
import { Modal } from '../../modals'
import { getGateVisits, incrementGateVisits } from '../../storage'

// When you pass through the ranbow door enough times, you get a randomly colored username
export const RainbowGateRoomView = () => {
  function randomEnum<T> (anEnum: T): T[keyof T] {
    const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex]
  }

  const dispatch = useContext(DispatchContext)

  const jumpThroughGate = async () => {
    const newVisits = await incrementGateVisits()
    dispatch(UpdateProfileColorAction(randomEnum(ValidColors)))
    dispatch(ShowModalAction(Modal.FeatureRainbowGate))
  }

  return <div id="rainbow-gate-div" className="feature-room-view">
    <p><button id="rainbow-gate-button" className='link-styled-button' onClick={jumpThroughGate}>Change Your Face Paint.</button></p>
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
      <p>The referee walks over to you and unceremoniously dumps a cooler filled with vibrant paint all over you.</p>
      <p> Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span>.</p>
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
