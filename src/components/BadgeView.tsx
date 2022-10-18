import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Badge } from '../../server/src/badges'
import customEmojiMap from '../emoji/customEmojiMap.json'
import reservedEmojiMap from '../emoji/reservedEmojiMap.json'

export default function BadgeView (props: {badge: Badge, isCustom?: boolean}) {
  const b = props.badge

  if (!(b && b.description && b.emoji)) {
    return <span />
  }

  const content = props.isCustom
    ? <img alt={`${b.emoji} emoji`} className={`custom-badge badge-text-${b.emoji}`} src={customEmojiMap[b.emoji] ?? reservedEmojiMap[b.emoji]}/>
    : <span className={`badge-text-${b.emoji}`}>{b.emoji }</span>

  // The weird nested badge-text-[emoji] span is for drag preview shenanigans
  // See the dragstart event handler in BadgesModalView.tsx for context
  return (
    <>
      <span className='badge' data-tip={b.description}>
        {content}
      </span>
      <ReactTooltip />
    </>
  )
}
