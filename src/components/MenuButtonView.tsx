import React, { useContext } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import config from '../config'
import { ShowEditProfileAction } from '../Actions'
import { DispatchContext } from '../App'

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
    dispatch(ShowEditProfileAction())
  }

  return (
    <div id="menu-button">
      <ContextMenuTrigger id="topMenu" holdToDisplay={0}>
        <strong>{props.username}</strong> <FaChevronDown />
      </ContextMenuTrigger>
      <ContextMenu id={'topMenu'}>
        <MenuItem onClick={showProfile}>Profile</MenuItem>
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </ContextMenu>
    </div>
  )
}
