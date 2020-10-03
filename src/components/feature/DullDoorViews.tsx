import React, { useContext } from 'react'
import { DispatchContext, UserMapContext } from '../../App'
import { UpdateProfileColorAction, ShowModalAction, HideModalAction } from '../../Actions'
import { Modal } from '../../modals'

// When you pass through the ranbow door enough times, you get a randomly colored username
export const DullDoorRoomView = () => {
  const dispatch = React.useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]

  const walkThroughDoor = () => {
    if (user.nameColor) {
      localStorage.setItem('WasColoredEntering', JSON.stringify(true))
    } else {
      localStorage.setItem('WasColoredEntering', JSON.stringify(false))
    }
    dispatch(ShowModalAction(Modal.FeatureDullDoor))
  }

  return <div id="dull-door-div" className="feature-room-view">
    <p>There is the boringest door imaginable standing in front of you. <button id="dull-door-button" className='link-styled-button' onClick={walkThroughDoor}>Walk through the door</button>.</p>
  </div>
}

export default function DullDoorModalView () {
  const dispatch = React.useContext(DispatchContext)

  const giveColor = () => {
    dispatch(UpdateProfileColorAction(null))
    dispatch(HideModalAction())
  }
  const leave = () => {
    dispatch(HideModalAction())
  }

  const wasColoredEntering: boolean = JSON.parse(localStorage.getItem('WasColoredEntering'))
  if (!wasColoredEntering) {
    return (
      <div>
        <h1>You see a very, very bored Octopode sitting in a cubicle.</h1>
        <p>It&apos;s poking unenthusiastically at his computer with four of his tentacles and eating his lunch with the rest. It
          looks very tired. You wave to catch its attention, and it glances over at you. You can see it trying to muster some
          effort for a greeting, but then it sighs and sinks into its seat. &quot;I&apos;m sorry,&quot; it says, &quot;these reports were due two
          days ago. I don&apos;t have the time or energy to chat.&quot;
        </p>
        <p>You leave it to its reports.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>You see a very, very bored octopode sitting in a cubicle.</h1>
        <p>It&apos;s poking unenthusiastically at his computer with four tentacles and eating lunch with the rest. As it spots you, its eyes go wide. A coffee mug in one tentacle drops to its desk with a loud thump, and a fork in another clatters to the ground.
        </p>
        <p>&quot;Oh!&quot; it shouts, &quot;Stay right where you are!&quot;. Before you can even turn to the door, the octopode jets in front of you
          in a cloud of dark gray smoke.</p>
        <p>&quot;Look,&quot; says the octopode, &quot;I&apos;m begging you! You don&apos;t know how dull this place is, and I&apos;ve been
          stuck here for the last four nights doing these reports! They&apos;re overdue two days and they won&apos;t let me leave
          until they&apos;re done!&quot;</p>

        <p>&quot;That color you have in your name, that&apos;ll do the trick! I don&apos;t have time to explain, but suffice it to say I&apos;m in a very tight spot and that color will fix things.&quot;</p>
        <p>&quot;You&apos;re free to go either way, but I&apos;d be really grateful if you could leave me your
          color.&quot;</p>

        <p><strong>Leave your name color behind?</strong></p>
        <button id='dull-door-agree' onClick={giveColor}>Agree</button>
        <button id='dull-door-agree' onClick={leave}>Leave</button>
      </div>
    )
  }
}
