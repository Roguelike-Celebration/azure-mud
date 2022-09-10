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

export default function MapModalView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const showList = () => {
    dispatch(ShowModalAction(Modal.RoomList))
  }
  return (
    <div>
      <h1>Map</h1>
      <p>Click on a room to move there!</p>
      <p>If you find the map difficult to use, you can also view a <button className='link-styled-button' onClick={showList}>list of all rooms</button>.</p>
      <MapView presenceData={props.presenceData} currentRoomId={props.currentRoomId} />
    </div>
  )
}
