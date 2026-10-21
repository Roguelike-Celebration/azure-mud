import React, { useContext, useEffect, useState } from 'react'

import { HideModalAction, ShowModalAction, UpdateProfileColorAction } from '../../Actions'
import { DispatchContext, UserMapContext } from '../../App'
import { Modal } from '../../modals'
import * as Storage from '../../storage'

// When you pass through the rainbow door enough times, you get a randomly colored username.
// This undoes that.
export const DullDoorRoomView = () => {
  const dispatch = useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]

  const pullTheCleanRope = () => {
    dispatch(UpdateProfileColorAction(null))
    dispatch(ShowModalAction(Modal.FeatureDullDoor))
  }

  return <div id="dull-door-div" className="feature-room-view">
    <p><button id="dull-door-button" className='link-styled-button' onClick={pullTheCleanRope}>Wash Off Your Face Paint.</button></p>
  </div>
}

export default function DullDoorModalView () {
  const dispatch = useContext(DispatchContext)

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
      <p>You are dunked with a large orange cooler of some kind of sports drink mixed with soap. This leaves you feeling fresh and new, smelling vaguely of citrus.</p>
    </div>
  )
  // }
}
