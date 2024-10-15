import React, { useContext, useEffect, useState } from 'react'
import { DispatchContext, UserMapContext } from '../../App'
import { UpdateProfileColorAction, ShowModalAction, HideModalAction } from '../../Actions'
import { Modal } from '../../modals'
import * as Storage from '../../storage'

// When you pass through the rainbow door enough times, you get a randomly colored username.
// This undoes that.
export const DullDoorRoomView = () => {
  const dispatch = React.useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]

  const pullTheCleanRope = () => {
    dispatch(UpdateProfileColorAction(null))
    dispatch(ShowModalAction(Modal.FeatureDullDoor))
  }

  return <div id="dull-door-div" className="feature-room-view">
    <p><button id="dull-door-button" className='link-styled-button' onClick={pullTheCleanRope}>Remove your regrets</button></p>
  </div>
}

export default function DullDoorModalView () {
  const dispatch = React.useContext(DispatchContext)

  const [wasColoredEntering, setWasColoredEntering] = useState(false)

  useEffect(() => {
    (async () => {
      setWasColoredEntering(await Storage.getWasColoredEntering())
    })()
  }, [])

  const giveColor = () => {
    dispatch(UpdateProfileColorAction(null))
    dispatch(HideModalAction())
  }
  const leave = () => {
    dispatch(HideModalAction())
  }

  // This flag doesn't seem to be working, it's always false. Disabling for now since it's fine to just have the same message each time.
  /* if (!wasColoredEntering) {
    return (
      <div>
        <p>You&apos;re already free of whatever dye is in the water of the adjacent fountain, but no harm getting a little cleaner!</p>
        <p>You give your hands a scrub and feel refreshed, ready to brave the mall once more.</p>
      </div>
    )
  } else { */
  return (
    <div>
      <p>There&apos;s enough soap in this jug to last years, so nobody is going to notice if you help yourself.</p>
      <p>After all, the mall ownership likely doesn&apos;t appreciate those multi-coloured footprints you&apos;ve been leaving!</p>
      <p>With a generous pump of soap and some vigorous scrubbing, you&apos;re left dye-free and smelling vaguely of lemons.</p>
    </div>
  )
  // }
}
