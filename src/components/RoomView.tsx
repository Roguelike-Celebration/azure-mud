import * as React from 'react'
import { Room } from '../room'
import {
  moveToRoom,
  pickUpItem
} from '../networking'
import { DispatchContext } from '../App'
import {
  StopVideoChatAction,
  ShowModalAction
} from '../Actions'
import { FaChevronDown, FaChevronUp, FaCog } from 'react-icons/fa'

import '../../style/room.css'
import { Modal } from '../modals'
import { ConfettiRoomView } from './feature/ConfettiRoomView'
import { RainbowGateRoomView } from './feature/RainbowGateViews'
import { DullDoorRoomView } from './feature/DullDoorViews'
import { FullRoomIndexRoomView } from './feature/FullRoomIndexViews'
import { linkActions } from '../linkActions'
import { useState } from 'react'
import _ from 'lodash'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import PresenceView from './PresenceView'
import { PresenceCountMap, RoomDataMap } from '../reducer'

const VIDEO_CHAT_MAX_SIZE = 8

interface Props {
  room: Room;
  userId: string;
  roomData: RoomDataMap;
  presenceData: PresenceCountMap;
  inMediaChat: boolean;
  keepCameraWhenMoving: boolean;
  textOnlyMode: boolean;
  mediaChatView?: React.ReactElement
  hasDismissedAModal: boolean
}

export default function RoomView (props: Props) {
  const dispatch = React.useContext(DispatchContext)
  const {
    prepareForMediaChat,
    joinCall,
    unpublishMedia
  } = useMediaChatContext()
  const { room } = props

  const [fullDescriptionVisible, setFullDescriptionVisible] =
      useState<boolean>(true)

  // This is very silly.
  // Since we're manually setting raw HTML, we can't get refs to add proper click handlers
  // Instead, we just hijack ALL clicks in the description, and check if they're for a link
  // TODO: Eventually change this to return React elements instead.
  const descriptionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLElement)) {
      return
    }
    const roomId = e.target.getAttribute('data-room')
    if (roomId) {
      moveToRoom(roomId)
      return
    }

    const itemName = e.target.getAttribute('data-item')
    if (itemName) {
      pickUpItem(itemName)
    }

    const actionName = e.target.getAttribute('data-action')
    if (actionName) {
      // roomId is required because some of these send messages to the server
      linkActions[actionName](roomId)
    }

    const showModal = e.target.getAttribute('data-modal')
    if (showModal) {
      dispatch(ShowModalAction(Modal.SpecialFeatureText))
    }
  }

  const toggleRoomDescriptionClick = () => {
    setFullDescriptionVisible(!fullDescriptionVisible)
  }

  React.useEffect(() => {
    if (room && room.mediaChat && !props.textOnlyMode && props.hasDismissedAModal) {
      // HACK ALERT: This call is necessary to properly set the state variables related to leaving video chat, since
      // our Twilio state isn't quite synchronized with our react state. We never publish if we don't want to (due to
      // passing keepCameraWhenMoving into joinCall) so we aren't publishing and unpublishing. We still need to sync.
      if (!props.keepCameraWhenMoving) {
        leaveVideoChat()
      }
      prepareForMediaChat()
      joinCall(props.room.id, props.keepCameraWhenMoving)
    }
  }, [props.room.id, props.hasDismissedAModal])

  const leaveVideoChat = () => {
    dispatch(StopVideoChatAction())
    unpublishMedia()
  }

  const showNoteWall = () => {
    dispatch(ShowModalAction(Modal.NoteWall))
  }

  const showRiddles = () => {
    dispatch(ShowModalAction(Modal.Riddles))
  }

  let noteWallView: React.ReactElement | undefined
  if (room && room.hasNoteWall) {
    if (room.noteWallData) {
      noteWallView = (
        <div>
          {room.noteWallData.roomWallDescription}{' '}
          <button onClick={showNoteWall}>
            {room.noteWallData.noteWallButton}
          </button>
        </div>
      )
    } else {
      noteWallView = (
        <div>
          One of the walls has space for attendees to put up sticky notes.{' '}
          <button onClick={showNoteWall}>View note wall</button>
        </div>
      )
    }
  }

  // TODO: Don't hard-code order of features
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div id="room">
      <h1 id="room-name">
        {room ? room.displayName : 'Loading...'}
        <button
          type="button"
          id="room-collapse-button"
          className="link-styled-button"
          onClick={toggleRoomDescriptionClick}
        >
          {fullDescriptionVisible ? (
            <span>
              Hide Description <FaChevronUp />
            </span>
          ) : (
            <span>
              Show Description <FaChevronDown />
            </span>
          )}
        </button>
      </h1>

      <div
        id="full-room-description"
        className={fullDescriptionVisible ? '' : 'collapsed'}
      >
        <div
          id="static-room-description"
          onClick={descriptionClick}
          dangerouslySetInnerHTML={{
            __html: room
              ? parseDescription(room.description, props.roomData, props.presenceData)
              : 'Loading current room...'
          }}
        />
        {room && room.id === 'theater' ? <StreamEmbed /> : null}
        {room &&
        room.specialFeatures &&
        room.specialFeatures.includes('RAINBOW_DOOR') ? (
            <RainbowGateRoomView />
          ) : (
            ''
          )}
        {room &&
        room.specialFeatures &&
        room.specialFeatures.includes('DULL_DOOR') ? (
            <DullDoorRoomView />
          ) : (
            ''
          )}
        {room &&
        room.specialFeatures &&
        room.specialFeatures.includes('FULL_ROOM_INDEX') ? (
            <FullRoomIndexRoomView />
          ) : (
            ''
          )}
        {room?.specialFeatures?.includes('CONFETTI') &&
          <ConfettiRoomView />
        }
        {room && room.riddles ? (
          <button id="riddle-button" onClick={showRiddles}>
            {room.riddles.length > 1
              ? 'Examine the Riddles'
              : 'Examine the Riddle'}
          </button>
        ) : (
          ''
        )}
        {noteWallView}
      </div>
      {room ? (
        <PresenceView
          users={room.users}
          userId={props.userId}
          roomId={room.id}
        />
      ) : (
        ''
      )}
      {props.mediaChatView || ''}
    </div>
  )
}

function parseDescription (
  description: string,
  roomData: RoomDataMap,
  presenceData: PresenceCountMap
): string {
  // This code used to get room = roomData[roomId], but now that room data is JIT, it
  // is normal for that to be absent. The links don't actually use data from roomData, so
  // that is now skipped.

  // Complex "[[text->target]]" links
  const complexLinkRegex = /\[\[([^\]]*?)->([^\]]*?)\]\]/g
  description = description.replace(complexLinkRegex, (match: string, text: string, roomId: string) => {
    const userCount = presenceData[roomId]
    const textEsc = _.escape(text)
    const roomIdEsc = _.escape(roomId)
    if (roomId === 'item') {
      return `<a class='room-link' href='#' data-item='${textEsc}'>${textEsc}</a>`
    } else if (roomId === 'showModal') {
      return `<a class='room-link' href='#' data-modal='${roomId}'>${textEsc}</a>`
    } else if (linkActions[roomId]) {
      return `<a class='room-link' href='#' data-action='${roomId}'>${textEsc}</a>`
    } else {
      // With room data being JIT, it's now expected that roomData[roomId] might be empty,
      // even for valid rooms. So, assume that any roomId that isn't a match for some other
      // sort of link target is indeed a room ID.
      const userCountString = userCount > 0 ? ` (${userCount})` : ''
      return `<a class='room-link' href='#' data-room='${roomIdEsc}'>${textEsc}${userCountString}</a>`
    }
  })

  // Simple "[[roomId]]" links
  // TODO: Escape roomId here, but be careful about doing it! Some of our links currently (2026)
  // might only work due to accidents of the truncation of unescaped room long-names matching the roomId.
  const simpleLinkRegex = /\[\[(.+?)\]\]/g
  description = description.replace(simpleLinkRegex, (match: string, roomId: string) => {
    const userCount = presenceData[roomId]
    const userCountString = userCount > 0 ? ` (${userCount})` : ''
    return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}${userCountString}</a>`
  })
  return description
}

// The youtube embed needs to be updated each event after the upcoming live youtube stream is created. The captions shouldn't need changing.
export function StreamEmbed () {
  const streamRef = React.useRef<HTMLIFrameElement>(null)
  const captionsRef = React.useRef<HTMLIFrameElement>(null)

  return (
    <div id="iframes" style={{ margin: 'auto' }}>
      <iframe
        width="560"
        title="stream"
        ref={streamRef}
        height="315"
        src="https://www.youtube.com/embed/R8DSq8qSJ44"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <iframe
        id="captions"
        title="captions"
        ref={captionsRef}
        width="560"
        height="100"
        src="https://www.streamtext.net/player/?event=RoguelikeCelebration&chat=false&header=false&footer=false&indicator=false&ff=Consolas&fgc=93a1a1"
        frameBorder="0"
        allow="autoplay; encrypted-media;"
        allowFullScreen
      ></iframe>
    </div>
  )
}
