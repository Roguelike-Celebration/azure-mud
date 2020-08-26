import React, { useContext } from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { DispatchContext, UserMapContext } from '../App'
import ReactTooltip from 'react-tooltip'
import {
  ShowProfileAction,
  BanToggleAction,
  HideModalAction
} from '../Actions'
import { User } from '../../server/src/user'

import '../../style/nameView.css'

export default function NameView (props: { userId: string; id?: string }) {
  const dispatch = useContext(DispatchContext)
  const { userMap, myId } = useContext(UserMapContext)

  const user: User = userMap[props.userId]
  const username = user && user.username
  const isMod = user && user.isMod
  const isBanned = user && user.isBanned

  const player = userMap[myId]
  const playerCanBan = player && player.isMod

  const handleProfile = (e, data) => {
    dispatch(HideModalAction())
    dispatch(ShowProfileAction(data.id))
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

  // TODO: need to know if the current user is a mod
  const banButton = playerCanBan ? (
    <MenuItem
      data={{ id: props.userId, username: username }}
      onClick={handleBan}
    >
      {isBanned ? 'Unban' : 'Ban'}
    </MenuItem>
  ) : (
    ''
  )

  // #issue 43: Left click for dropdowns in addition to rightclick. Apparently disabling "holdToDisplay" can make this happen,
  // not sure what the side effects are though.
  // https://github.com/vkbansal/react-contextmenu/issues/50#issuecomment-335855193
  //
  // Tooltip: If no pronouns are set, no tooltip will show

  return (
    <span className="name" data-tip={user && user.pronouns}>
      <ContextMenuTrigger id={props.id} renderTag="span" holdToDisplay={0}>
        <strong>
          {username || 'unknown'}
          {isMod ? '👑' : ''}
        </strong>
      </ContextMenuTrigger>
      <ContextMenu id={props.id}>
        <MenuItem data={{ id: props.userId }} onClick={handleProfile}>
          Profile/Whisper
        </MenuItem>
        {banButton}
      </ContextMenu>
      <ReactTooltip />
    </span>
  )
}
