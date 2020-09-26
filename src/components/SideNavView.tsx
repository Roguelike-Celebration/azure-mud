import React, { useContext } from 'react'
import { Room } from '../room'
import { moveToRoom } from '../networking'
import MenuButtonView from './MenuButtonView'
import { FaVideo } from 'react-icons/fa'

import '../../style/nav.css'
import { IsMobileContext, DispatchContext } from '../App'
import { HideSideMenuAction, ShowModalAction } from '../Actions'
import { Modal } from '../modals'
import RoomNameView from './RoomNameView'

interface Props {
  rooms: Room[];
  username: string;
  spaceIsClosed?: boolean;
}

export default function RoomListView (props: Props) {
  const isMobile = useContext(IsMobileContext)
  const dispatch = useContext(DispatchContext)

  const close = () => {
    dispatch(HideSideMenuAction())
  }

  return (
    <nav id="side-menu" role="navigation" aria-label="List of rooms you can navigate to">
      {isMobile ? <button
        onClick={close}
        id='close-button'
        className='close'
      >x</button> : ''}
      <MenuButtonView username={props.username} spaceIsClosed={props.spaceIsClosed} />
      <ul>
        <MenuItem title="Map" modal={Modal.Map} />
        <MenuItem title="Schedule" modal={Modal.Schedule} />
        <MenuItem title="Code of Conduct" modal={Modal.CodeOfConduct} />
        <MenuItem title="Help" modal={Modal.Help} />
        <hr style={{ marginTop: '1em', marginBottom: '1em' }}/>
        {props.rooms.map((r) => {
          return r.hidden ? '' : <li><RoomNameView roomId={r.id} key={`room-sidebar-${r.id}`} /></li>
        })}
      </ul>
    </nav>
  )
}

const MenuItem = (props: {title: string, modal: Modal}) => {
  const dispatch = useContext(DispatchContext)

  const handler = () => {
    dispatch(ShowModalAction(props.modal))
  }
  return (
    <li>
      <button onClick={handler}>
        <strong>{props.title}</strong>
      </button>
    </li>
  )
}
