import React, { useContext } from 'react'
import { FaCog } from 'react-icons/fa'

import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import { ShowModalAction } from '../Actions'
import { DispatchContext, UserMapContext } from '../App'
import { Modal } from '../modals'
import { fetchProfile, openOrCloseSpace, disconnect } from '../networking'
import { signOut } from '../authentication'

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
      disconnect(myId).then(() => {
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

  return (
    <div id="menu-button">
      <ContextMenuTrigger id="topMenu" holdToDisplay={0}>
        <strong>{props.username}</strong> <FaCog />
      </ContextMenuTrigger>
      <ContextMenu id={'topMenu'}>
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
