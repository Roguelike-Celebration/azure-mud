import React, { useEffect, VideoHTMLAttributes, useRef } from 'react'
import NameView from './NameView'
import LocalMediaView from './LocalMediaView'

import '../../style/videoChat.css'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import ParticipantChatView from './ParticipantChatView'

interface MediaProps {
  visibleSpeakers: [string, Date][]
  currentSpeaker: string
  numberOfFaces: number
}

export default function MediaChatView (props: MediaProps) {
  const { publishingCamera, callParticipants } = useMediaChatContext()

  // TODO: props.visibleSpeakers should never be undefined, but it is?!
  const visibleSpeakers = (props.visibleSpeakers || []).map(x => x[0])

  console.log('Re-rendering media chat view?')

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

  // We might have folks on video, but no "dominantSpeaker" notifications generated yet.
  // We should still flesh out the wall o' faces in that situation.
  // NOTE: This will result in video folks being added in whatever they appear in an Arrayified callParticipants
  // I don't know what that ordering is, or if it's deterministic.
  while (videoParticipantIds.length < 1 && audioParticipantIds.length > props.numberOfFaces) {
    videoParticipantIds.push(audioParticipantIds.shift())
  }

  const videoParticipants = videoParticipantIds.map((p) => {
    return (
      <ParticipantChatView
        key={`participant-chat-view-${p.identity}`}
        participant={p}
        isDominant={props.currentSpeaker === p.identity}
        renderAsFace={true}
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

  return (
    <div id="media-wrapper">
      <label>
        {participants ? participants.length : 0} other chatters (
        {audioParticipants.length} offscreen).{' '}
      </label>
      <div id="media-view">
        {playerVideo} {videoParticipants} {audioParticipants}
      </div>
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
