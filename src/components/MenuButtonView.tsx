import React, { useContext } from 'react'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import { FaCog } from 'react-icons/fa'

import { ShowModalAction } from '../Actions.js'
import { DispatchContext, UserMapContext } from '../App.js'
import { signOut } from '../authentication.js'
import { Modal } from '../modals.js'
import { disconnect, fetchProfile, openOrCloseSpace } from '../networking.js'

import NameView from './NameView.js'

export default function MenuButtonView (props: { username: string, spaceIsClosed: boolean }) {
  const dispatch = useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]
  const isMod = user && user.isMod

  const logOut = () => {
    const prompt = confirm('Are you sure you want to log out?')
    // TODO: When a user disconnects via the /disconnect endpoint, it still shows that user as in the room. I suspect
    // the same is true for banned users. Check on that.
    if (prompt) {
      disconnect().then(() => {
        signOut().then(() => {
          window.location.reload()
        })
      }).catch((error) => {
        console.log('error signing out', error)
        window.location.reload()
      })
    }
  }

  const toggleSpaceAvailability = () => {
    const doToggle = confirm(
      `Are you sure you would like to ${props.spaceIsClosed ? 'open' : 'close'} the space for all non-mod users?`
    )
    if (doToggle) {
      openOrCloseSpace(!props.spaceIsClosed)
    }
  }

  const toggleSpaceItem = <MenuItem onClick={toggleSpaceAvailability}>{props.spaceIsClosed ? 'Open' : 'Close'} the Space</MenuItem>

  const showProfile = () => {
    fetchProfile(myId)
  }

  const showProfileEdit = () => {
    dispatch(ShowModalAction(Modal.ProfileEdit))
  }

  const showSettings = () => {
    dispatch(ShowModalAction(Modal.Settings))
  }

  const showServerSettings = () => {
    dispatch(ShowModalAction(Modal.ServerSettings))
  }

  const showBadges = () => {
    dispatch(ShowModalAction(Modal.Badges))
  }

  return (
    <div id="menu-button">
      <ContextMenuTrigger id="topMenu" holdToDisplay={0}>
        <NameView userId={myId} skipMenu={true} id={`topMenu-${myId}`} />
        <FaCog style={{ marginLeft: '5px' }}/>
      </ContextMenuTrigger>
      <ContextMenu id={'topMenu'}>
        <MenuItem onClick={showBadges}>Show Badges</MenuItem>
        <MenuItem onClick={showProfile}>View Profile</MenuItem>
        <MenuItem onClick={showProfileEdit}>Edit Profile</MenuItem>
        <MenuItem onClick={showSettings}>Settings & Theme</MenuItem>
        {isMod ? toggleSpaceItem : null}
        {isMod ? <MenuItem onClick={showServerSettings}>Server Settings</MenuItem> : null}
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </ContextMenu>
    </div>
  )
}
