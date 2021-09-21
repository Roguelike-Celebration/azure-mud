import React, { useContext } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import config from '../config'
import { ShowModalAction } from '../Actions'
import { DispatchContext, UserMapContext } from '../App'
import { Modal } from '../modals'
import { fetchProfile, openOrCloseSpace } from '../networking'
import firebase from 'firebase/app'
import 'firebase/auth'

export default function MenuButtonView (props: { username: string, spaceIsClosed: boolean }) {
  const dispatch = useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user = userMap[myId]
  const isMod = user && user.isMod

  const logOut = () => {
    const prompt = confirm('Are you sure you want to log out?')
    // TODO: This doesn't actually log out the user from the MUD, just from firebase, so the MUD thinks the user's
    // still in the room and everything. Uh, fix that somehow.
    if (prompt) {
      firebase.auth().signOut().then(() => {
        window.location.reload()
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
