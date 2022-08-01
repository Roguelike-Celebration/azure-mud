import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Badge } from '../../server/src/badges'

export default function BadgeView (props: {badge: Badge}) {
  const b = props.badge
  return (
    <>
      <span className='badge' data-tip={b.description}>{b.emoji}</span>
      <ReactTooltip eventOff='mousedow' globalEventOff='mousedown' />
    </>
  )
}
