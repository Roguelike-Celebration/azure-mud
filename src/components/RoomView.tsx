import * as React from 'react'
import { Room } from '../room'
import {
  moveToRoom,
  pickUpItem,
  dropItem
} from '../networking'
import NameView from './NameView'
import { DispatchContext, UserMapContext } from '../App'
import {
  StopVideoChatAction,
  ShowModalAction,
  ShowModalWithOptionsAction,
  SetTextOnlyModeAction
} from '../Actions'
import { FaCog, FaVideo } from 'react-icons/fa'

import '../../style/room.css'
import { Modal } from '../modals'
import { SpecialFeature } from '../../server/src/rooms'
import { RainbowGateRoomView } from './feature/RainbowGateViews'
import { DullDoorRoomView } from './feature/DullDoorViews'
import { FullRoomIndexRoomView } from './feature/FullRoomIndexViews'
import { linkActions } from '../linkActions'
import { useContext } from 'react'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import PresenceView from './PresenceView'

const VIDEO_CHAT_MAX_SIZE = 8

interface Props {
  room: Room;
  userId: string;
  roomData: { [roomId: string]: Room };
  inMediaChat: boolean;
  keepCameraWhenMoving: boolean;
  textOnlyMode: boolean;
}

export default function RoomView (props: Props) {
  const dispatch = React.useContext(DispatchContext)
  const {
    prepareForMediaChat,
    currentMic,
    currentCamera,
    publishingCamera,
    publishingMic,
    inCall,
    joinCall,
    publishMedia,
    publishAudio,
    unpublishMedia
  } = useMediaChatContext()

  const { room } = props

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

  const toggleClick = (e) => {
    var fullRoomDesc = document.getElementById('full-room-description')
    if (fullRoomDesc) {
      fullRoomDesc.classList.toggle('collapsed')
    }
  }

  React.useEffect(() => {
    if (room && !room.noMediaChat && !props.textOnlyMode) {
      // HACK ALERT: This call is necessary to properly set the state variables related to leaving video chat, since
      // our Twilio state isn't quite synchronized with our react state. We never publish if we don't want to (due to
      // passing keepCameraWhenMoving into joinCall) so we aren't publishing and unpublishing. We still need to sync.
      if (!props.keepCameraWhenMoving) {
        leaveVideoChat()
      }
      prepareForMediaChat()
      joinCall(props.room.id, props.keepCameraWhenMoving)
    }
  }, [props.room.id])

  const joinVideoChat = async () => {
    if (currentMic || currentCamera) {
      publishMedia()
    } else {
      dispatch(ShowModalAction(Modal.MediaSelector))
    }
  }

  const joinAudioChat = async () => {
    if (currentMic) {
      publishAudio()
    } else {
      dispatch(
        ShowModalWithOptionsAction(Modal.MediaSelector, { hideVideo: true })
      )
    }
  }

  const enableTextOnlyMode = () => {
    const prompt = confirm('Entering text-only mode will disable all audio/video aspects of this space other than the ' +
      'stream in the theater. You will no longer be able to see or hear other participants, but you can still ' +
      'interact via text chat. Switching modes will refresh your page - please be patient while it reloads.'
    )
    if (prompt) {
      dispatch(SetTextOnlyModeAction(true, true))
    }
  }

  const disableTextOnlyMode = () => {
    const prompt = confirm('Entering video/audio mode means that you will be able to see and hear video and audio from ' +
      'other participants. Your camera and microphone will default to off when you switch modes. Switching modes will ' +
      'refresh your page - please be patient while it reloads.'
    )
    if (prompt) {
      dispatch(SetTextOnlyModeAction(false, true))
    }
  }

  const leaveVideoChat = () => {
    dispatch(StopVideoChatAction())
    unpublishMedia()
  }

  const showNoteWall = () => {
    dispatch(ShowModalAction(Modal.NoteWall))
  }

  const showMediaSelector = () => {
    dispatch(ShowModalAction(Modal.MediaSelector))
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

  let chatButtons
  if (room && !room.noMediaChat) {
    if (props.inMediaChat) {
      let leaveButtonLabel = ''
      if (publishingCamera && publishingMic) {
        leaveButtonLabel = 'Turn off Camera and Mic'
      } else if (publishingCamera) {
        // This case shouldn't ever exist with the current UI
        leaveButtonLabel = 'Turn off Camera'
      } else if (publishingMic) {
        leaveButtonLabel = 'Turn off Mic'
      }
      chatButtons = (
        <>
          <button onClick={leaveVideoChat} id="join-video-chat">
            {leaveButtonLabel}
          </button>
          <button
            key="show-media-selector"
            id="big-reconfigure-media-selector"
            onClick={showMediaSelector}
            className="link-styled-button video-button"
            aria-label="Show Media Selector"
          >
            <FaCog />
          </button>
        </>
      )
    } else if (props.textOnlyMode) {
      chatButtons = [
        <button key="text-only-mode" onClick={disableTextOnlyMode} id="toggle-text-only-mode">
          Enable Audio/Video Mode
        </button>
      ]
    } else {
      chatButtons = [
        <button key="join-video" onClick={joinVideoChat} id="join-video-chat">
          { inCall ? 'Join Video + Audio' : <s>Join Video + Audio</s> }
        </button>,
        <button key="join-audio" onClick={joinAudioChat} id="join-video-chat">
          { inCall ? 'Join Audio' : <s>Join Audio</s> }
        </button>,
        <button key="text-only-mode" onClick={enableTextOnlyMode} id="toggle-text-only-mode">
          Enable Text Only Mode
        </button>,
        <button
          key="show-media-selector"
          id="big-reconfigure-media-selector"
          onClick={showMediaSelector}
          className="link-styled-button video-button"
          aria-label="Show Media Selector"
        >
          <FaCog />
        </button>
      ]
    }
  }

  // TODO: Don't hard-code order of features
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div id="room">
      <h1 id="room-name">
        {room ? room.name : 'Loading...'}
        {chatButtons}
      </h1>
      <button type="button" id="room-collapse-button" onClick={toggleClick}>
        Toggle Room Details...
      </button>
      <div id="full-room-description">
        <div
          id="static-room-description"
          onClick={descriptionClick}
          dangerouslySetInnerHTML={{
            __html: room
              ? parseDescription(room.description, props.roomData)
              : 'Loading current room...'
          }}
        />
        {room && room.id === 'theater' ? <StreamEmbed /> : null}
        {room &&
        room.specialFeatures &&
        room.specialFeatures.includes(SpecialFeature.RainbowDoor) ? (
            <RainbowGateRoomView />
          ) : (
            ''
          )}
        {room &&
        room.specialFeatures &&
        room.specialFeatures.includes(SpecialFeature.DullDoor) ? (
            <DullDoorRoomView />
          ) : (
            ''
          )}
        {room &&
        room.specialFeatures &&
        room.specialFeatures.includes(SpecialFeature.FullRoomIndex) ? (
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
          videoUsers={room.videoUsers}
          roomId={room.id}
        />
      ) : (
        ''
      )}
    </div>
  )
}

function parseDescription (
  description: string,
  roomData: { [roomId: string]: Room }
): string {
  // eslint-disable-next-line no-useless-escape
  const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
  const simpleLinkRegex = /\[\[(.+?)\]\]/g

  description = description.replace(complexLinkRegex, (match, text, roomId) => {
    const room = roomData[roomId]
    if (roomId === 'item') {
      return `<a class='room-link' href='#' data-item='${text}'>${text}</a>`
    } else if (room) {
      const userCount =
        room && room.users && room.users.length > 0
          ? ` (${room.users.length})`
          : ''
      return `<a class='room-link' href='#' data-room='${roomId}'>${text}${userCount}</a>`
    } else if (linkActions[roomId]) {
      return `<a class='room-link' href='#' data-action='${roomId}'>${text}</a>`
    } else {
      console.log(
        `Dev warning: tried to link to room ${roomId}, which doesn't exist`
      )
    }
  })

  description = description.replace(simpleLinkRegex, (match, roomId) => {
    const room = roomData[roomId]
    if (!room) {
      console.log(
        `Dev warning: tried to link to room ${roomId}, which doesn't exist`
      )
    }
    const userCount =
      room && room.users && room.users.length > 0
        ? ` (${room.users.length})`
        : ''
    return `<a class='room-link' href='#' data-room='${roomId}'>${roomId}${userCount}</a>`
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
