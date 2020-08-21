import React, { useContext } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import config from '../config'
import { ShowModalAction } from '../Actions'
import { DispatchContext } from '../App'
import { Modal } from '../modals'

export default function MenuButtonView (props: { username: string }) {
  const dispatch = useContext(DispatchContext)

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
        <MenuItem onClick={showProfile}>Profile</MenuItem>
        <MenuItem onClick={showThemeSelector}>Select Theme</MenuItem>
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </ContextMenu>
    </div>
  )

}