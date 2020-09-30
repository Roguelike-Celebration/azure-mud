import React, { useContext } from 'react'
import { Room } from '../room'
import { moveToRoom } from '../networking'
import MenuButtonView from './MenuButtonView'
import { FaVideo } from 'react-icons/fa'

import '../../style/nav.css'
import { IsMobileContext, DispatchContext } from '../App'
import { HideSideMenuAction, ShowModalAction } from '../Actions'
import { Modal } from '../modals'

interface Props {
  rooms: Room[];
  username: string;
  spaceIsClosed?: boolean;
}

export default function SideNavView (props: Props) {
  const isMobile = useContext(IsMobileContext)
  const dispatch = useContext(DispatchContext)

  const close = () => {
    dispatch(HideSideMenuAction())
  }

  const showMap = () => {
    dispatch(ShowModalAction(Modal.Map))
  }

  return (
    <nav id="side-menu" role="navigation" aria-label="List of rooms you can navigate to">
      {isMobile ? <button
        onClick={close}
        id='close-button'
        className='close'
      >x</button> : ''}
      <MenuButtonView username={props.username} spaceIsClosed={props.spaceIsClosed} />
      <button id='nav-map-button' onClick={showMap}>Map</button>
      <ul>
        <MenuItem title="Schedule" modal={Modal.Schedule} />
        <MenuItem title="Room List" modal={Modal.RoomList} />
        <MenuItem title="Code of Conduct" modal={Modal.CodeOfConduct} />
        <MenuItem title="Help" modal={Modal.Help} />
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
      <button className='nav-item' onClick={handler}>
        <strong>{props.title}</strong>
      </button>
    </li>
  )
}
}
