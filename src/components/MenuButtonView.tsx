import React, { useContext } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import config from '../config'
import { ShowModalAction } from '../Actions'
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
    dispatch(ShowModalAction(Modal.ProfileEdit))
  }

  const showThemeSelector = () => {
    dispatch(ShowModalAction(Modal.ThemeSelector))
  }

  return (
    <div id="menu-button">
      <ContextMenuTrigger id="topMenu" holdToDisplay={0}>
        <strong>{props.username}</strong> <FaChevronDown />
      </ContextMenuTrigger>
      <ContextMenu id={'topMenu'}>
        <MenuItem onClick={showProfile}>Edit Profile</MenuItem>
        <MenuItem onClick={showThemeSelector}>Select Theme</MenuItem>
        {isMod ? toggleSpaceItem : null}
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </ContextMenu>
    </div>
  )
}
