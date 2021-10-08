import React, { useContext } from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { DispatchContext, UserMapContext } from '../App'
import ReactTooltip from 'react-tooltip'
import {
  BanToggleAction,
  HideModalAction,
  ModToggleAction
} from '../Actions'
import { User } from '../../server/src/user'

import '../../style/nameView.css'
import { fetchProfile } from '../networking'

export default function NameView (props: { userId: string; id?: string }) {
  const dispatch = useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user: User = userMap[props.userId]
  const username = user && user.username
  const isMod = user && user.isMod
  const isBanned = user && user.isBanned

  const player = userMap[myId]
  const playerIsMod = player && player.isMod

  const handleProfile = (e, data) => {
    dispatch(HideModalAction())
    fetchProfile(data.id)
  }

  const handleBan = (e, data) => {
    const doBan = confirm(
      `Are you sure you would like to ${isBanned ? 'unban' : 'ban'} the user '${
        data.username
      }'?`
    )
    if (doBan) {
      dispatch(BanToggleAction(data.id))
    }
  }

  const handleMod = (e, data) => {
    const doMod = confirm(
      `Are you sure you would like to ${isMod ? 'remove' : 'add'} the user '${
        data.username
      }' ${isMod ? 'from' : 'to'} the mod list?`
    )
    if (doMod) {
      dispatch(ModToggleAction(data.id))
    }
  }

  const banButton = playerIsMod ? (
    <MenuItem
      data={{ id: props.userId, username: username }}
      onClick={handleBan}
    >
      {isBanned ? 'Unban' : 'Ban'}
    </MenuItem>
  ) : (
    ''
  )

  const modButton = playerIsMod ? (
    <MenuItem
      data={{ id: props.userId, username: username }}
      onClick={handleMod}
    >
      {isMod ? 'Remove Mod' : 'Make Mod'}
    </MenuItem>
  ) : (
    ''
  )

  // #issue 43: Left click for dropdowns in addition to rightclick. Apparently disabling "holdToDisplay" can make this happen,
  // not sure what the side effects are though.
  // https://github.com/vkbansal/react-contextmenu/issues/50#issuecomment-335855193
  //
  // Tooltip: If no pronouns are set, no tooltip will show

  var className = 'name'
  if (user && user.nameColor) {
    className = className + ' ' + user.nameColor
  }
  return (
    <span className={className} data-tip={user && user.pronouns}>
      <ContextMenuTrigger id={props.id} renderTag="span" holdToDisplay={0}>
        <strong className={isMod ? 'mod' : ''}>
          {isMod ? '[Mod] ' : ''}
          {(user && user.polymorph) || ''}
          {username || 'unknown'}
        </strong>
      </ContextMenuTrigger>
      <ContextMenu id={props.id}>
        <MenuItem data={{ id: props.userId }} onClick={handleProfile}>
          Profile
        </MenuItem>
        <MenuItem data={{ id: props.userId }} onClick={handleProfile}>
          Whisper
        </MenuItem>
        {banButton}
        {modButton}
      </ContextMenu>
      <ReactTooltip />
    </span>
  )
}
