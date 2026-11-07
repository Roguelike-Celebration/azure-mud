import React, { useContext } from 'react'

import { Badge } from '../../server/src/badges.js'
import { ShowModalAction } from '../Actions.js'
import { DispatchContext } from '../App.js'
import { Modal } from '../modals.js'

import BadgeView from './BadgeView.js'

export default function BadgeUnlockModal (props: { badge: Badge }) {
  const { badge } = props
  const dispatch = useContext(DispatchContext)
  const showBadges = () => {
    dispatch(ShowModalAction(Modal.Badges))
  }

  return (
    <div>
      <h1>You earned a badge!</h1>

      <div>You can now equip the <BadgeView emoji={badge?.emoji} description={badge?.description} isCustom={badge?.isCustom} /> badge!</div>

      <button style={{ marginTop: '1em' }} onClick={showBadges}>Show Badge Inventory</button>

    </div>
  )
}
