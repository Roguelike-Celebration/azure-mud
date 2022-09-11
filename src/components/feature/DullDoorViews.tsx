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

  const walkThroughDoor = () => {
    if (user.nameColor) {
      Storage.setWasColoredEntering(true)
    } else {
      Storage.setWasColoredEntering(false)
    }
    dispatch(ShowModalAction(Modal.FeatureDullDoor))
  }

  return <div id="dull-door-div" className="feature-room-view">
    <p><button id="dull-door-button" className='link-styled-button' onClick={walkThroughDoor}>Pull the clean rope</button>.</p>
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

  if (!wasColoredEntering) {
    return (
      <div>
        <h1>Refreshing!</h1>
        <p>Doctor Hope gives you a bored look of disappointment as a stream of clear liquid falls down from the open pipes above you. The liquid covers your body, leaving you feeling refreshed.</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>As you sit in the chair, Doctor Hope looks up with excitement and begins to approach. As your hand touches the clean rope, however, she rolls her eyes and returns to her work. A stream of clear liquid covers your body, leaving you feeling refreshed.</p>
      </div>
    )
  }
}
