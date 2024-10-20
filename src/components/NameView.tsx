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
import { fetchProfile, toggleUserSpeaker } from '../networking'
import { Modal } from '../modals'
import BadgeView from './BadgeView'

interface Props {
  userId: string
  nowrap?: boolean

  /* A contextMenu ID */
  id: string
  /* If true, don't render a clickable menu */
  skipMenu?: boolean
}
export default function NameView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { useSimpleNames } = useContext(SettingsContext)
  const { userMap, myId } = useContext(UserMapContext)

  ReactTooltip.rebuild()

  const isSelf = props.userId === myId

  // This will fail if the user's client has the wrong year set,
  // that shouldn't be a concern?
  const thisYear: string = `${(new Date()).getFullYear()}`
  const lastYear: string = `${(new Date()).getFullYear() - 1}`

  const user: User = userMap[props.userId]
  const username = user && user.username
  const isMod = user && user.isMod
  const isSpeaker = user && user.speakerYears?.includes(thisYear)
  const isBanned = user && user.isBanned

  // isMod = the user whose name being rendered is a mod
  // userIsMod = the user who is logged in is a mod
  const userIsMod = userMap[myId].isMod

  // This sometimes gets called before `connect` returns any users
  // That itself is a bug to fix, but this can at least guard against it.
  if (!user || (Object.keys(userMap).length === 1 && !isSelf)) {
    return <div />
  }

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

  const handleSpeaker = (e, data) => {
    const doSpeaker = confirm(
      `Are you sure you would like to ${isSpeaker ? 'remove' : 'add'} the user '${
        data.username
      }' ${isSpeaker ? 'from' : 'to'} the current (${thisYear}) speaker list?`
    )
    if (doSpeaker) {
      toggleUserSpeaker(data.id, thisYear)
    }
  }

  const handlePastSpeaker = (e, data) => {
    toggleUserSpeaker(data.id, lastYear)
  }

  const pastSpeakerButton = userIsMod ? (
    <MenuItem
      data={
        { id: props.userId }
      }
      onClick={handlePastSpeaker}
    >
    Make Previous (${lastYear}) Speaker
    </MenuItem>
  ) : (
    ''
  )

  const banButton = userIsMod ? (
    <MenuItem
      data={{ id: props.userId, username: username }}
      onClick={handleBan}
    >
      {isBanned ? 'Unban' : 'Ban'}
    </MenuItem>
  ) : (
    ''
  )

  const modButtons = userIsMod ? (
    <>
      <MenuItem
        data={{ id: props.userId, username: username }}
        onClick={handleMod}
      >
        {isMod ? 'Remove Mod' : 'Make Mod'}
      </MenuItem>
      <MenuItem
        data={{ id: props.userId, username: username }}
        onClick={handleSpeaker}
      >
        {isSpeaker ? 'Remove Speaker' : 'Make Speaker'}
      </MenuItem>
    </>
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
  if (userIsMod) {
    className += ' mod'
  }

  const badges = (user.equippedBadges || [])
    .map((b, i) => <BadgeView key={`badge-${i}`} emoji={b?.emoji} description={b?.description} isCustom={b?.isCustom} />)

  if (isSpeaker) {
    badges.unshift(
      <BadgeView key='badge-speaker' isCustom={true} emoji='speaker' description='Speaker' />
    )
  }

  if (user.isMod) {
    badges.unshift(
      <BadgeView key='badge-mod' isCustom={true} emoji='mod' description='Moderator' />
    )
  }

  // TODO: should be best handled via css
  const customStyle = { ['whiteSpace' as any]: props.nowrap ? 'nowrap' : undefined }

  const nameEl = (
    <strong data-tip={!useSimpleNames && (user?.pronouns ?? '')} className={isMod ? 'mod' : ''}>
      {(!useSimpleNames && user && user.polymorph) || ''}
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
      {pastSpeakerButton}
    </ContextMenu></>

    return (
      <span className={className} style={customStyle} >
        {props.skipMenu ? nameEl : menu}
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
        {modButtons}
        {pastSpeakerButton}
      </ContextMenu>
    </>

    return (
      <span className={className} style={customStyle} >
        {props.skipMenu ? nameEl : menu}
      </span>
    )
  }
}
