import React from 'react'
import { Room } from '../room'

import MapView from './MapView'

 interface Props {
  roomData: { [roomId: string]: Room };
  currentRoomId: string
 }

export default function MiniMapView (props: Props) {
  return (
    <div id='mini-map'>
      <MapView roomData={props.roomData} currentRoomId={props.currentRoomId} isMiniMap={true} />
    </div>
  )
}
