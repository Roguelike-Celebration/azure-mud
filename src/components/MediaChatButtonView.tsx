import React from 'react'
import { FaCog } from 'react-icons/fa'
import { SetAudioOnlyModeAction, SetTextOnlyModeAction, ShowModalAction, ShowModalWithOptionsAction, StopVideoChatAction } from '../Actions'
import { DispatchContext } from '../App'
import { Modal } from '../modals'
import { useMediaChatContext } from '../videochat/mediaChatContext'

interface Props {
  inMediaChat: boolean
  textOnlyMode: boolean
  offscreenCount: number
  audioOnlyMode: boolean
}
const MediaChatButtonView = (props: Props) => {
  const {
    currentMic,
    currentCamera,
    publishingCamera,
    publishingMic,
    inCall,
    publishMedia,
    publishAudio,
    unpublishMedia
  } = useMediaChatContext()

  const dispatch = React.useContext(DispatchContext)

  const leaveVideoChat = () => {
    dispatch(StopVideoChatAction())
    unpublishMedia()
  }

  const joinVideoChat = async () => {
    if (currentMic || currentCamera) {
      publishMedia()
    } else {
      dispatch(ShowModalAction(Modal.MediaSelector))
    }
  }

  const showMediaSelector = () => {
    dispatch(ShowModalAction(Modal.MediaSelector))
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
      'interact via text chat.\n\nSwitching modes will refresh your page - please be patient while it reloads.'
    )
    if (prompt) {
      dispatch(SetTextOnlyModeAction(true, true))
    }
  }

  const disableTextOnlyMode = () => {
    const prompt = confirm('Entering video/audio mode means that you will be able to see and hear video and audio from ' +
      'other participants. Your camera and microphone will default to off when you switch modes.\b\n\nSwitching modes will ' +
      'refresh your page - please be patient while it reloads.'
    )
    if (prompt) {
      dispatch(SetTextOnlyModeAction(false, true))
    }
  }

  const toggleAudioOnlyMode = () => {
    const prompt = confirm(
      'Entering audio-only mode will hide all video feeds from other attendees. ' +
        "You will still be able to hear them, but you won't see them. This may improve performance if things are slow.\n\n" +
        'Note that you will still broadcast your webcam feed to others if you enable it, and you will ' +
        'still be able to see the talks broadcast in the Theater.'
    )
    if (prompt) {
      dispatch(SetAudioOnlyModeAction(!props.audioOnlyMode))
    }
  }

  let chatButtons
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
      <button key="join-audio" onClick={joinAudioChat} id="join-audio-chat">
        { inCall ? 'Join Audio' : <s>Join Audio</s> }
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

  var offscreenLabel
  if (props.offscreenCount > 0) {
    offscreenLabel = (
      <div className="offscreen-count">
        {props.offscreenCount} {props.offscreenCount === 1 ? 'person is' : 'people are'} in the call but not visible.
      </div>
    )
  }

  return (
    <div id="media-chat-buttons">
      {offscreenLabel}
      {chatButtons}
      <div>
        <button
          key="audio-only-mode"
          onClick={toggleAudioOnlyMode}
          id="toggle-audio-only-mode"
          className="link-styled-button"
        >
          {props.audioOnlyMode ? 'Disable' : 'Enable'} Audio-Only Mode
        </button>
        <button
          key="text-only-mode"
          onClick={enableTextOnlyMode}
          id="toggle-text-only-mode"
          className="link-styled-button"
        >
          Enable Text-Only Mode
        </button>
      </div>
    </div>
  )
}

export default MediaChatButtonView
