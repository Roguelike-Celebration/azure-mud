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
    <p>Inside the glass tube there&apos;s nothing in particular, though you note that there&apos;s a grate on the floor. A damp sign next to the tube&apos;s opening says &quot;Secondarily-Hydrogenated Oxygen Weighted Emulsion Remover&quot;. A smaller sign below that reads &quot;For Dirts, Dyes, and Distress!&quot; <button id="dull-door-button" className='link-styled-button' onClick={walkThroughDoor}>Step on the grate</button>.</p>
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
        <p>As you step into the tube, the grating beneath you depresses and clicks. Suddenly the machine gurgles and from openings the top of the tube, warm Secondarily-Hydrogenated Oxygen (miracle of the modern age!) streams down on you and rinses any Dirts, Dyes, or Distress you may have accrued away. It&apos;s soothing, in its own odd way, but you aren&apos;t sure this so-called S.H.O.W.E.R. will catch on with the masses.</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Could be refreshing?</h1>
        <p>You tentatively press a toe onto the grate. Suddenly the machine gurgles and from openings the top of the tube, warm Secondarily-Hydrogenated Oxygen (miracle of the modern age!) streams down! It certainly seems like any Dirts, Dyes, or Distress you may have accrued will be washed away if you step in fully. It&apos;ll probably be refreshing, but it will <em>definitely</em> take the paint from the doctor(?) with it.</p>
        <p><strong>Fully enter the S.H.O.W.E.R.?</strong></p>
        <button id='dull-door-agree' onClick={giveColor}>Enter</button>
        <button id='dull-door-agree' onClick={leave}>Leave</button>
      </div>
    )
  }
}
