import React, { useContext } from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { DispatchContext, SettingsContext, UserMapContext } from '../App'
import ReactTooltip from 'react-tooltip'
import {
  BanToggleAction,
  HideModalAction,
  ModToggleAction,
  ShowModalAction
} from '../Actions'
import { User } from '../../server/src/user'

import '../../style/nameView.css'
import { fetchProfile } from '../networking'
import { Modal } from '../modals'
import BadgeView from './BadgeView'

interface Props {
  userId: string
  nowrap?: boolean

  /* A contextMenu ID */
  id?: string
  /* If true, don't render a clickable menu */
  skipMenu?: boolean
}
export default function NameView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { useSimpleNames } = useContext(SettingsContext)
  const { userMap, myId } = useContext(UserMapContext)

  const isSelf = props.userId === myId

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
  if (!useSimpleNames && user && user.nameColor) {
    className = className + ' ' + user.nameColor
  }
  if (!useSimpleNames && user && user.fontReward) {
    className = className + ' font-' + user.fontReward
  }

  const badges = (user.equippedBadges || [])
    .map((b, i) => <BadgeView key={`badge-${i}`} badge={b} />)

  // TODO: This is not yet being set anywhere
  if (user.isSpeaker) {
    badges.unshift(
      <BadgeView key='badge-speaker' badge={{ emoji: '📢', description: 'Speaker' }} />
    )
  }

  if (user.isMod) {
    badges.unshift(
      <BadgeView key='badge-mod' badge={{ emoji: '🆘', description: 'Moderator' }} />
    )
  }

  // TODO: should be best handled via css
  const customStyle = { ['whiteSpace' as any]: props.nowrap ? 'nowrap' : undefined }

  const nameEl = (
    <strong className={isMod ? 'mod' : ''}>
      {isMod ? '[Mod] ' : ''}
      {username || 'unknown'}
      {useSimpleNames ? '' : badges}
    </strong>
  )

  if (isSelf) {
    const showProfileEdit = () => {
      dispatch(ShowModalAction(Modal.ProfileEdit))
    }

    const showBadges = () => {
      dispatch(ShowModalAction(Modal.Badges))
    }

    const menu = <><ContextMenuTrigger id={props.id} renderTag="span" holdToDisplay={0}>
      {nameEl}
    </ContextMenuTrigger>
    <ContextMenu id={props.id}>
      <MenuItem onClick={showBadges}>
            Show Badges
      </MenuItem>

      <MenuItem data={{ id: props.userId }} onClick={handleProfile}>
            View Profile
      </MenuItem>
      <MenuItem onClick={showProfileEdit}>
            Edit Profile
      </MenuItem>

    </ContextMenu></>

    return (
      <span className={className} data-tip={user?.pronouns} style={customStyle} >
        {props.skipMenu ? nameEl : menu}
        <ReactTooltip />
      </span>
    )
  } else {
    const menu = <>
      <ContextMenuTrigger id={props.id} renderTag="span" holdToDisplay={0}>
        {nameEl}
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
    </>

    return (
      <span className={className} data-tip={user?.pronouns} style={customStyle} >
        {props.skipMenu ? nameEl : menu}
        <ReactTooltip />
      </span>
    )
  }
}
