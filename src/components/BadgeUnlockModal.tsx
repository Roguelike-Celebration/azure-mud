import React from 'react'
import { Badge } from '../../server/src/badges'
import BadgeView from './BadgeView'

export default function BadgeUnlockModal (props: {badge: Badge}) {
  return (
    <div>
      <h1>You earned a badge!</h1>

      <div>You can now equip the <BadgeView badge={props.badge}/> badge!</div>

      <p>Click your name and choose the 'show badges' option to try it out.</p>

    </div>
  )
}
