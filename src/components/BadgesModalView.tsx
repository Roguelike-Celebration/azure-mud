import React, { DragEventHandler } from 'react'
import { DispatchContext } from '../App'

import '../../style/badges.css'

import BadgeView from './BadgeView'

import { Badge } from '../../server/src/badges'
import { EquipBadgeAction } from '../Actions'
import { equipBadge } from '../networking'

interface Props {
  unlockedBadges: Badge[]
  equippedBadges: Badge[]
}

export default function BadgesModalView (props: Props) {
  const dispatch = React.useContext(DispatchContext)
  console.log(props.equippedBadges)

  const dragStart = (e) => {
    // TODO: Dismiss tooltip / get preview correct

    const index = e.target.dataset.index
    const badge = props.unlockedBadges[index]
    e.dataTransfer.setData('text/plain', JSON.stringify(badge))
    e.dataTransfer.dropEffect = 'copy'

    // By default, the drag preview is the element being dragged
    // In our case, the tooltip messes with the size and it looks weird.
    // This gives us a drag preview element that is *just* the emoji
    const emoji = document.querySelector(`#badges .badge-text-${badge.emoji}`)
    e.dataTransfer.setDragImage(emoji, 0, 0)
  }

  // Without the dragover event being prevented, the drop event won't fire
  const dragOver = (e) => {
    e.preventDefault()
  }

  const drop = (e) => {
    const badge = JSON.parse(e.dataTransfer.getData('text/plain'))
    const index = e.currentTarget.dataset.index
    dispatch(EquipBadgeAction(badge, index))
    equipBadge(badge, index)
  }

  // If there's a badge in the right position but not the left, a[0] is undefined
  // Running array.map on an array with undefined values skips the undefineds
  // This means we need a for loop instead of a map.
  const rawEquippedBadges = props.equippedBadges || []
  const equippedBadges = []
  for (let i = 0; i < Math.max(rawEquippedBadges.length, 2); i++) {
    const b = rawEquippedBadges[i]
    console.log(i, b)
    if (b) {
      equippedBadges.push(
        <span
          className='selected-badge'
          data-index={i}
          key={`selected-${i}`}
          onDrop={drop}
          onDragOver={dragOver}>
          <BadgeView key={b.emoji} badge={b} />
        </span>
      )
    } else {
      equippedBadges.push(
        <span
          className='selected-badge'
          data-index={i}
          key={`selected-${i}`}
          onDrop={drop}
          onDragOver={dragOver}>
            &nbsp;
        </span>
      )
    }
  }

  const unlockedBadges = (props.unlockedBadges || []).map((b, i) => {
    return (
      <span
        className='unlocked-badge'
        draggable={true}
        key={b.emoji}
        data-index={i}
        onDragStart={dragStart}
      >
        <BadgeView badge={b} />
      </span>
    )
  })

  return (
    <div id='badges'>
      <h1>Your Badges</h1>
      <div>
        <h2>Equipped</h2>
        {equippedBadges}
      </div>
      <div>
        <h2>Unlocked</h2>
        {unlockedBadges}
      </div>
    </div>
  )
}
