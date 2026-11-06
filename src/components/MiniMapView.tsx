import React, { useContext } from 'react'

import { ShowModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { Modal } from '../modals'
import { PresenceCountMap } from '../reducer'

import MapView from './MapView'

interface Props {
  presenceData: PresenceCountMap;
  currentRoomId: string
}

export default function MiniMapView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    dispatch(ShowModalAction(Modal.Map))
    e.stopPropagation()
  }

  return (
    <div id='mini-map' onClickCapture={handleClickCapture} style={{ cursor: 'pointer' }}>
      <MapView presenceData={props.presenceData} currentRoomId={props.currentRoomId} isMiniMap={true} />
    </div>
  )
}
