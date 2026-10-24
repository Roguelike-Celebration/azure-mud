import React, { useContext } from 'react'

import { ShowModalAction } from '../Actions.js'
import { DispatchContext } from '../App.js'
import { Modal } from '../modals.js'
import { PresenceCountMap } from '../reducer.js'

import MapView from './MapView.js'

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
