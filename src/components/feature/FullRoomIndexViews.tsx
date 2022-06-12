import React from 'react'
import { DispatchContext } from '../../App'
import { ShowModalAction } from '../../Actions'
import { Modal } from '../../modals'
import { Room } from '../../room'

export const FullRoomIndexRoomView = () => {
  const dispatch = React.useContext(DispatchContext)

  const handleClick = () => {
    dispatch(ShowModalAction(Modal.FeatureFullRoomIndex))
  }

  return <div id="full-room-index-div" className="feature-room-view">
    <button id="full-room-index-button" onClick={handleClick}>Read the book</button>
  </div>
}

export default function FullRoomIndexModalView (props: { rooms: Room[] }) {
  return (
    <div>
      <h1>Unerring Teleport</h1>
      <p>Verbal elements - either the True Name of the destination, the two common names of the destination, or the name of the destination from an adjoining location (which can only be known from that destination, and is colored in green for whatever reason). The name must exact, but the volume of the incantation is irrelevant.</p>
      <p>Somatic elements - /go or /move</p>
      <p>Material components - none</p>
      <p>This spell will take you to whichever place you wish, hidden or not. The only issue is that the names of the hidden places are obscured by dark magics. I, the Great Wizard Teleportus, have researched long and hard, and at last produced a complete list of all the room in this space. Bow before my awesome intelligence!</p>
      <p>Examples:</p>
      <ul>
        <li key='example-0'><em>/go hiddenPortalRoom</em> utilizes the true name to return here</li>
        <li key='example-1'><em>/move leap into the shimmering portal</em> utilizes the name of the destination (&apos;leap into the shimmering portal&apos;) from the adjacent room (here)</li>
        <li key='example-2'><em>/move Unconferencing: Sokoban</em> utilizes the first common name</li>
        <li key='example-3'><em>/go the artists&apos; atelier</em> utilizes the second common name</li>
      </ul>
      <table>
        <tbody>
          <tr>
            <th key='common-1-header'>common (first)</th>
            <th key='common-2-header'>common (second)</th>
            <th key='true-header'>true</th>
          </tr>
          {
            props.rooms.map((e) => {
              return <tr key={e.id}>
                <td key={`common-1-${e.id}`}>{e.displayName}</td>
                <td key={`common-2-${e.id}`}>{e.shortName}</td>
                <td key={`true-${e.id}`}>{e.id}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  )
}
