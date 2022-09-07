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
import { RainbowGateRoomView } from './feature/RainbowGateViews'
import { DullDoorRoomView } from './feature/DullDoorViews'
import { FullRoomIndexRoomView } from './feature/FullRoomIndexViews'
import { linkActions } from '../linkActions'
import { useState } from 'react'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import PresenceView from './PresenceView'

const VIDEO_CHAT_MAX_SIZE = 8

interface Props {
  room: Room;
  userId: string;
  roomData: { [roomId: string]: Room };
  presenceData: { [roomId: string]: number };
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
  const descriptionClick = (e) => {
    const roomId =
      e.target && e.target.getAttribute && e.target.getAttribute('data-room')
    if (roomId) {
      moveToRoom(roomId)
      return
    }

    const itemName =
      e.target && e.target.getAttribute && e.target.getAttribute('data-item')
    if (itemName) {
      pickUpItem(itemName)
    }

    const actionName =
      e.target && e.target.getAttribute && e.target.getAttribute('data-action')
    if (actionName) {
      linkActions[actionName]()
    }
  }

  const toggleRoomDescriptionClick = (e) => {
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

  let noteWallView
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
  roomData: { [roomId: string]: Room },
  presenceData: { [roomId: string]: number }
): string {
  // eslint-disable-next-line no-useless-escape
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
  const simpleLinkRegex = /\[\[(.+?)\]\]/g

  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    const room = roomData[roomId]
    const userCount = presenceData[roomId]
    if (roomId === 'item') {
      return `<a class='room-link' href='#' data-item='${text}'>${text}</a>`
    } else if (room) {
      const userCountString = userCount > 0 ? ` (${userCount})` : ''
      return `<a class='room-link' href='#' data-room='${roomId}'>${text}${userCountString}</a>`
    } else if (linkActions[roomId]) {
      return `<a class='room-link' href='#' data-action='${roomId}'>${text}</a>`
    } else {
      // TODO: This warning is now expected, with room data being JIT
      console.log(
        `Dev warning: tried to link to room ${roomId}, which doesn't exist`
      )
    }
  })

  description = description.replace(simpleLinkRegex, (match, roomId) => {
    const room = roomData[roomId]
    if (!room) {
      // TODO: This warning is now expected, with room data being JIT
      console.log(
        `Dev warning: tried to link to room ${roomId}, which doesn't exist`
      )
    }
    const userCount = presenceData[roomId]
    const userCountString = userCount > 0 ? ` (${userCount})` : ''
    return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}${userCountString}</a>`
  })
  return description
}

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
        src="https://www.youtube.com/embed/live_stream?channel=UCKv_QzXft4mD6TXmQBZtzIA"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
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
