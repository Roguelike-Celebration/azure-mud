import React, { useContext } from 'react'
import { ShowModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { Modal } from '../modals'
import { Room } from '../room'

import MapView from './MapView'

 interface Props {
  presenceData: { [roomId: string]: number };
  currentRoomId: string
 }

export default function MiniMapView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const handleClickCapture = (e) => {
    dispatch(ShowModalAction(Modal.Map))
    e.stopPropagation()
  }

  return (
    <div id='mini-map' onClickCapture={handleClickCapture} style={{ cursor: 'pointer' }}>
      <MapView presenceData={props.presenceData} currentRoomId={props.currentRoomId} isMiniMap={true} />
    </div>
  )
}
