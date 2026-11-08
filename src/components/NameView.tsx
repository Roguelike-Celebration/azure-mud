import React, { useContext } from 'react'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu-rlc'
import ReactDOM from 'react-dom'

import { MinimalUser } from '../../server/src/user.js'
import {
  BanToggleAction,
  HideModalAction,
  ModToggleAction,
  ShowModalAction
} from '../Actions.js'
import { DispatchContext, SettingsContext, UserMapContext } from '../App.js'
import { tooltipAttrs } from '../display.js'
import { Modal } from '../modals.js'
import { fetchProfile, toggleUserSpeaker } from '../networking.js'

import BadgeView from './BadgeView.js'
import '../../style/nameView.css'

interface Props {
  /** Id of the user being viewed (not necessarily the user of this session viewing it). */
  userId: string
  /** A contextMenu ID */
  id: string
  /** If true, don't render a clickable menu */
  skipMenu?: boolean
}

export default function NameView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { useSimpleNames } = useContext(SettingsContext)
  const { userMap, myId } = useContext(UserMapContext)
  // isMod = the user whose name is being rendered (target) is a mod
  // myIsMod = the user who is logged in (operator) is a mod
  // More generally here, "blah" = target user, "myBlah" = operating user
  const myIsMod = userMap[myId].isMod

  const userId = props.userId
  const isSelf = userId === myId
  const user: MinimalUser = userMap[userId]
  const username = user && user.username
  const isMod = user && user.isMod
  const isSpeaker = user && user.isSpeaker
  const isBanned = user && user.isBanned

  // This sometimes gets called before `connect` returns any users
  // That itself is a bug to fix, but this can at least guard against it.
  if (!user || (Object.keys(userMap).length === 1 && !isSelf)) {
    return <div />
  }

  const handleProfile = () => {
    dispatch(HideModalAction())
    fetchProfile(userId)
  }

  const handleWhisper = () => {
    // Whisper history shows in profile, so Whisper just uses the profile view.
    handleProfile()
  }

  const handleBan = () => {
    const doBan = confirm(
      `Are you sure you would like to ${isBanned ? 'unban' : 'ban'} the user '${username}'?`
    )
    if (doBan) {
      dispatch(BanToggleAction(userId))
    }
  }

  const handleMod = () => {
    const doMod = confirm(
      `Are you sure you would like to ${isMod ? 'remove' : 'add'} the user '${username}' ` +
      `${isMod ? 'from' : 'to'} the mod list?`
    )
    if (doMod) {
      dispatch(ModToggleAction(userId))
    }
  }

  const handleSpeaker = () => {
    const doSpeaker = confirm(
      `Are you sure you would like to ${isSpeaker ? 'remove' : 'add'} the user ` +
      `'${username}' ${isSpeaker ? 'from' : 'to'} the speaker list?`
    )
    if (doSpeaker) {
      toggleUserSpeaker(userId, '2026')
    }
  }

  const handlePastSpeaker = () => {
    toggleUserSpeaker(userId, '2025')
  }

  const pastSpeakerButton = myIsMod ? (
    <MenuItem onClick={handlePastSpeaker}>
      Make Past Speaker
    </MenuItem>
  ) : (
    ''
  )

  const modButtons = myIsMod ? (
    <>
      <MenuItem onClick={handleBan}>
        {isBanned ? 'Unban' : 'Ban'}
      </MenuItem>
      <MenuItem onClick={handleMod}>
        {isMod ? 'Remove Mod' : 'Make Mod'}
      </MenuItem>
      <MenuItem onClick={handleSpeaker}>
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
  if (myIsMod) {
    className += ' mod'
  }

  const badges = (user.equippedBadges || [])
    .map((b, i) => <BadgeView key={`badge-${i}`} emoji={b?.emoji} description={b?.description} isCustom={b?.isCustom} />)

  if (isSpeaker) {
    badges.unshift(
      <BadgeView key='badge-speaker' isCustom={true} emoji='speaker' description='Speaker' />
    )
  }

  if (isMod) {
    badges.unshift(
      <BadgeView key='badge-mod' isCustom={true} emoji='mod' description='Moderator' />
    )
  }

  const nameEl = (
    <strong {...tooltipAttrs(!useSimpleNames && (user?.pronouns ?? ''))} className={isMod ? 'mod' : ''}>
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
    {/* Portal to main <body> to avoid inheriting message line's styling like dimming */}
    {ReactDOM.createPortal(
      <ContextMenu id={props.id}>
        <MenuItem onClick={showBadges}>
          Show Badges
        </MenuItem>
        <MenuItem onClick={handleProfile}>
          View Profile
        </MenuItem>
        <MenuItem onClick={showProfileEdit}>
          Edit Profile
        </MenuItem>
        {pastSpeakerButton}
      </ContextMenu>,
      document.body
    )}</>

    return (
      <span className={className} >
        {props.skipMenu ? nameEl : menu}
      </span>
    )
  } else {
    const menu = <>
      <ContextMenuTrigger id={props.id} renderTag="span" holdToDisplay={0}>
        {nameEl}
      </ContextMenuTrigger>
      {/* Portal to main <body> to avoid inheriting message line's styling like dimming */}
      {ReactDOM.createPortal(
        <ContextMenu id={props.id}>
          <MenuItem onClick={handleProfile}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleWhisper}>
            Whisper
          </MenuItem>
          {modButtons}
          {pastSpeakerButton}
        </ContextMenu>,
        document.body
      )}</>

    return (
      <span className={className} >
        {props.skipMenu ? nameEl : menu}
      </span>
    )
  }
}
