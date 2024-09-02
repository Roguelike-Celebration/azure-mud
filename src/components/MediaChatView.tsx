import React, { useEffect, VideoHTMLAttributes, useRef, useState } from 'react'
import LocalMediaView from './LocalMediaView'

import '../../style/videoChat.css'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import ParticipantChatView from './ParticipantChatView'
import MediaChatButtonView from './MediaChatButtonView'
import { SetTextOnlyModeAction } from '../Actions'
import { DispatchContext } from '../App'
import { MinimalUser } from '../../server/src/user'

interface MediaProps {
  visibleSpeakers: [string, Date][]
  currentSpeaker: string
  numberOfFaces: number
  inMediaChat: boolean
  textOnlyMode: boolean
  audioOnlyMode: boolean
  currentUser: MinimalUser
}

export default function MediaChatView (props: MediaProps) {
  const { publishingCamera, callParticipants, inCall, joinCallFailed } = useMediaChatContext()
  const dispatch = React.useContext(DispatchContext)

  // TODO: props.visibleSpeakers should never be undefined, but it is?!
  const visibleSpeakers = (props.visibleSpeakers || []).map(x => x[0])

  console.log('Re-rendering media chat view?')

  if (!inCall) {
    if (joinCallFailed) {
      return (
        <div id="media-wrapper">
          <strong>
            Could not connect to audio/video! Rooms are max 50 chatters - if you
            want to use audio/video, try moving to another room. Otherwise, it
            may be a network issue.
          </strong>
        </div>
      )
    } else if (props.textOnlyMode) {
      const disableTextMode = () => {
        const prompt = confirm('Entering video/audio mode means that you will be able to see and hear video and audio from ' +
          'other participants. Your camera and microphone will default to off when you switch modes. Switching modes will ' +
          'refresh your page - please be patient while it reloads.'
        )
        if (prompt) {
          dispatch(SetTextOnlyModeAction(false, true))
        }
      }

      return (
        <div id="media-wrapper">
          There may be a voice/video call happening here that you can&apos;t see.
          <button className="link-styled-button" onClick={disableTextMode} style={{ marginLeft: '1em' }}>Disable Text-Only Mode</button>.
        </div>
      )
    } else {
      return (
        <div id="media-wrapper">
          <strong>Attempting to connect to room.</strong>
        </div>
      )
    }
  }

  // TODO: Is this a meaningful fail state? What causes this? s
  if (!callParticipants) {
    return <div id="media-view" />
  }

  let playerVideo
  if (publishingCamera) {
    playerVideo = <LocalMediaView speaking={false} />
  }

  const participants = Array.from(callParticipants.values())
    .filter(p => p.audioTracks.size + p.videoTracks.size > 0)

  const videoParticipantIds = participants
    .filter((p) => visibleSpeakers.includes(p.identity))

  const audioParticipantIds = participants
    .filter((p) => !visibleSpeakers.includes(p.identity))

  console.log('[NUM_FACES]: ', props.numberOfFaces)
  // We might have folks on video, but no "dominantSpeaker" notifications generated yet.
  // We should still flesh out the wall o' faces in that situation.
  // NOTE: This will result in video folks being added in whatever they appear in an Arrayified callParticipants
  // I don't know what that ordering is, or if it's deterministic.
  while (videoParticipantIds.length < props.numberOfFaces && audioParticipantIds.length > 0) {
    videoParticipantIds.push(audioParticipantIds.shift())
  }

  const videoParticipants = videoParticipantIds.map((p) => {
    return (
      <ParticipantChatView
        key={`participant-chat-view-${p.identity}`}
        participant={p}
        isDominant={props.currentSpeaker === p.identity}
        renderAsFace={!props.audioOnlyMode}
      />
    )
  })

  const audioParticipants = audioParticipantIds
    .map((p) => {
      <ParticipantChatView
        participant={p}
        isDominant={props.currentSpeaker === p.identity}
        renderAsFace={false}
      />
    })

  // TODO: This will eventually need to check for speakers as well
  // It's unclear to me if this logic should live here
  // (vs inside MediaChatButtonView, or in the data model proper)
  const canJoinVideoChat = props.currentUser.isMod

  // If we're showing the bar, we don't override the height; if we're hiding we force it to 0.
  // We still want it to render the audioParticipants, so that's why we still paint it.
  // TODO: this is jank
  const customStyle = { height: playerVideo || (!props.audioOnlyMode && videoParticipants.length > 0) ? undefined : '0px' }
  return (
    <div id="media-wrapper">
      <div id="media-view" style={customStyle}>
        {playerVideo} {videoParticipants} {audioParticipants}
      </div>
      <MediaChatButtonView
        textOnlyMode={props.textOnlyMode}
        inMediaChat={props.inMediaChat}
        totalCount={videoParticipants.length + audioParticipants.length}
        canJoinVideoChat={canJoinVideoChat}
        offscreenCount={
          props.audioOnlyMode
            ? videoParticipants.length + audioParticipants.length
            : audioParticipants.length
        }
        audioOnlyMode={props.audioOnlyMode}
      />
    </div>
  )
}

// via https://github.com/facebook/react/issues/11163
type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
};

export function HtmlVideo ({ srcObject, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return
    console.log(srcObject)
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  return <video ref={refVideo} {...props} autoPlay /> // eslint-disable-line jsx-a11y/media-has-caption
}
