import React, { useContext } from 'react'
import { Room } from '../room'
import MenuButtonView from './MenuButtonView'

import '../../style/nav.css'
import { IsMobileContext, DispatchContext } from '../App'
import { HideSideMenuAction, ShowModalAction } from '../Actions'
import { Modal } from '../modals'
import MiniMapView from './MiniMapView'

interface Props {
  presenceData: { [roomId: string]: number };
  currentRoomId: string
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

  const showHappeningNow = () => {
    dispatch(ShowModalAction(Modal.HappeningNow))
  }

  return (
    <nav id="side-menu" role="navigation" aria-label="List of rooms you can navigate to">
      {isMobile ? <button
        onClick={close}
        id='close-button'
        className='close'
      >x</button> : ''}
      <MenuButtonView username={props.username} spaceIsClosed={props.spaceIsClosed} />
      <button id='happening-now-button' onClick={showHappeningNow}>Happening Now</button>
      <button id='nav-map-button' onClick={showMap}>Map</button>
      <ul>
        <MenuItem title="Schedule" modal={Modal.Schedule} />
        <MenuItem title="Room List" modal={Modal.RoomList} />
        <MenuItem title="Code of Conduct" modal={Modal.CodeOfConduct} />
        <MenuItem title="Obelisk" modal={Modal.Obelisk} img='🔮' imgAlt='crystal ball'/>
        <a href="https://www.redbubble.com/people/Roguelike/shop" rel="noreferrer" target="_blank" style={{ color: 'var(--main-font)', textDecoration: 'none' }}><li><span role="img" aria-label="shirt">👕</span>Merch</li></a>
        <a href="https://store.steampowered.com/curator/41222044/sale/RoguelikeCelebration2025" rel="noreferrer" target="_blank" style={{ color: 'var(--main-font)', textDecoration: 'none' }}><li><span role="img" aria-label="shirt"></span>Steam Sale</li></a>
        <MenuItem title="Help" modal={Modal.Help} />
      </ul>
      {props.presenceData && props.currentRoomId
        ? <MiniMapView presenceData={props.presenceData} currentRoomId={props.currentRoomId}/>
        : null
      }
    </nav>
  )
}

const MenuItem = (props: {title: string, modal: Modal, img?: string, imgAlt?: string}) => {
  const dispatch = useContext(DispatchContext)

  const handler = () => {
    dispatch(ShowModalAction(props.modal))
  }
  return (
    <li>
      {props.img &&
        <span role="img" aria-label={props.imgAlt}>{props.img}</span>
      }
      <button className='nav-item' onClick={handler}>
        <strong>{props.title}</strong>
      </button>
    </li>
  )
}
