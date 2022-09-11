import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Badge } from '../../server/src/badges'

export default function BadgeView (props: {badge: Badge}) {
  const b = props.badge

  if (!(b && b.description && b.emoji)) {
    return <span />
  }

  // The weird nested badge-text-[emoji] span is for drag preview shenanigans
  // See the dragstart event handler in BadgesModalView.tsx for context
  return (
    <>
      <span className='badge' data-tip={b.description}>
        <span className={`badge-text-${b.emoji}`}>{b.emoji}</span>
      </span>
      <ReactTooltip />
    </>
  )
}
