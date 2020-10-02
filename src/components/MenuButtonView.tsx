import React, { useContext } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import config from '../config'
import { ShowModalAction, ShowProfileAction } from '../Actions'
import { DispatchContext, UserMapContext } from '../App'
import { Modal } from '../modals'
import { openOrCloseSpace } from '../networking'

export default function MenuButtonView (props: { username: string, spaceIsClosed: boolean }) {
  const dispatch = useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]
  const isMod = user && user.isMod

  const logOut = () => {
    const prompt = confirm('Are you sure you want to log out?')
    if (prompt) {
      window.location.href = `${
        config.SERVER_HOSTNAME
      }/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(
        window.location.href
      )}`
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
    dispatch(ShowProfileAction(myId))
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
        <strong>{props.username}</strong> <FaChevronDown />
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
