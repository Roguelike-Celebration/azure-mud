import React, { useContext } from 'react'
import { Badge } from '../../server/src/badges'
import { ShowModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { Modal } from '../modals'
import BadgeView from './BadgeView'

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
