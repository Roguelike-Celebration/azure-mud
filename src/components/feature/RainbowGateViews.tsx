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
    <p><button id="rainbow-gate-button" className='link-styled-button' onClick={jumpThroughGate}>Touch a crystal?</button></p>
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
      <p>You reach out to one of the crystals. Just as you feel your hand about to grab it the entire room disappears and you find yourself floating in an endless void. Images flash before your eyes of people you've known and those you don't yet. You see eyes filled with anger, sadness, love, and everything between.</p>
      <p>The smell of these memories you've not made yet overwhelms your mind and you feel your body drift aimlessly through them. Earthy aromas move in sync with the images of eyes and the feeling of every hug you've ever been given. </p>
      <p>You wake up in the instant you realize you had fallen unconscious. You are standing where you were moments ago, before you reached for the crystal. Your chat name color is now <span className={`name ${userMap[myId].nameColor}`}>{userMap[myId].nameColor}</span></p>
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
