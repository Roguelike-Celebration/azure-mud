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

  return <div id="dull-door-div">There is the boringest door imaginable standing in front of you.
    <button id="dull-door-button" onClick={walkThroughDoor}>Walk through the door</button>
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
          days ago. I don&pos;t have the time or energy to chat.&quot;
        </p>
        <p>You leave it to its reports.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>You see a very, very bored octopode sitting in a cubicle.</h1>
        <p>It&apos;s poking unenthusiastically at his computer with four of his tentacles and eating his lunch with the rest. It
          looks very tired. You wave to catch its attention, and it glances over at you. Its eyes go wide. The coffee mug it has
          in its #5 tentacle drops to its desk with a loud thump, and the fork in its #7 tentacle clatters to the ground.
        </p>
        <p>&quot;Oh!&quot; it shouts, &quot;how energetic you are! Stay right where you are!&quot;</p>
        <p>That sounds ominous. You turn around to exit the door, but before you can reach it the octopode jets in front of you
          in a cloud of dark gray smoke.</p>
        <p>&quot;Look,&quot; says the octopode, &quot;I&apos;m begging you! You don&apos;t know how dull this place is, and I&apos;ve been
          stuck here for the last four nights in a row doing these reports! They&apos;re overdue two days and they won&apos;t let me leave
          until they&apos;re done! That color you have, that&apos;ll do the trick! I just need something to help me get this report filed,
          which, I might add, is two days late because the invoices were held up on some random accountant&apos;s desk, because the
          memo I sent didn&apos;t get read, and so we never got the invoices and we can&apos;t do the books without the invoices, and when
          I told my boss that I&apos;d just walk down to accounting and pick them up, he said that&apos;d cause a fight with accounting,
          because -&quot;</p>
        <p>&quot;Look I&apos;m in a tight spot here. You&apos;re free to go either way, but I&apos;d be really grateful if you could leave me your
          color.&quot;</p>
        <button id='dull-door-agree' onClick={giveColor}>Agree</button>
        <button id='dull-door-agree' onClick={leave}>Leave</button>
      </div>
    )
  }
}
