import React, { useContext } from 'react'
import { DispatchContext, UserMapContext } from '../../App'
import { UpdateProfileColorAction, ShowModalAction } from '../../Actions'
import { Modal } from '../../modals'

// When you pass through the ranbow door enough times, you get a randomly colored username
export const DullDoorRoomView = () => {
  const dispatch = React.useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]

  const walkThroughDoor = () => {
    if (user.nameColor) {
      localStorage.setItem('WasColoredEntering', JSON.stringify(true))
      dispatch(UpdateProfileColorAction(null))
    } else {
      localStorage.setItem('WasColoredEntering', JSON.stringify(false))
    }
    dispatch(ShowModalAction(Modal.FeatureDullDoor))
  }

  return <div id="dull-door-div">There is the boringest door imaginable standing in front of you.
    <button id="dull-door-button" onClick={walkThroughDoor}>Walk through the door</button>
  </div>
}

export default function DullDoorModalView () {
  const wasColoredEntering: boolean = JSON.parse(localStorage.getItem('WasColoredEntering'))
  if (!wasColoredEntering) {
    return (
      <div>
        <h1>You see a very, very bored Octopode sitting in a cubicle.</h1>
        <p>It's poking unenthusiastically at his computer with four of his tentacles and eating his lunch with the rest. It
          looks very tired. You wave to catch its attention, and it glances over at you. You can see it trying to muster some
          effort for a greeting, but then it sighs and sinks into its seat. "I'm sorry," it says, "these reports were due two
          days ago. I don't have the time or energy to chat."
        </p>
        <p>You leave it to its reports.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>You see a very, very bored Octopode sitting in a cubicle.</h1>
        <p>It's poking unenthusiastically at his computer with four of his tentacles and eating his lunch with the rest. It
          looks very tired. You wave to catch its attention, and it glances over at you. Its eyes go wide. The coffee mug it has
          in its #5 tentacle drops to its desk with a loud thump, and the fork in its #7 tentacle clatters to the ground.
        </p>
        <p>"Oh!" it shouts, "how energetic you are! Stay right where you are!"</p>
        <p>Seconds later you realize that it's been quite a while since you last slept. All this computer-using is pretty
          tiring, actually. Wouldn't it be nice to just sit down for a minute, take it easy? Oh, that's helpful, the octopode
          has pushed its office chair right here, why not take a seat and rest for a second?</p>
        <p>When you awake, you're standing back in front of the door, feeling somehow less.</p>
      </div>
    ) 
  }
}
