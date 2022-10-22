import React from 'react'
import { Badge } from '../../server/src/badges'
import customEmojiMap from '../emoji/customEmojiMap.json'
import reservedEmojiMap from '../emoji/reservedEmojiMap.json'

function BadgeView (props: {emoji: string, description: string, isCustom?: boolean}) {
  const { emoji, description, isCustom } = props

  if (!(description && emoji)) {
    return <span />
  }

  const content = isCustom
    ? <img alt={`${emoji} emoji`} className={`custom-badge badge-text-${emoji}`} src={customEmojiMap[emoji] ?? reservedEmojiMap[emoji]}/>
    : <span className={`badge-text-${emoji}`}>{emoji}</span>

  // The weird nested badge-text-[emoji] span is for drag preview shenanigans
  // See the dragstart event handler in BadgesModalView.tsx for context
  return (
    <>
      <span className='badge' data-tip={description}>
        {content}
      </span>
    </>
  )
}

export default React.memo(BadgeView)
