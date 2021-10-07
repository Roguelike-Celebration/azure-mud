import React, {
  useEffect,
  VideoHTMLAttributes,
  useRef
} from 'react'
import NameView from './NameView'
import LocalMediaView from './LocalMediaView'

import '../../style/videoChat.css'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import ParticipantTracks from '../videochat/twilio/ParticipantTracks'

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  // All peers that the server considers to be 'in' videochat
  peerIds?: string[];

  speakingPeerIds: string[];
}

export default function MediaChatView (props: MediaProps) {
  let mediaSelector
  const { publishingCamera, callParticipants } = useMediaChatContext()
  console.log('Re-rendering media chat view?')

  let playerVideo
  if (publishingCamera) {
    playerVideo = (
      <LocalMediaView speaking={props.speakingPeerIds.includes('self')}/>
    )
  }

  let otherVideos
  console.log(callParticipants)
  if (callParticipants) {
    const liveTracks = (Array.from(callParticipants.values())).map((p) => {
      var anyAudioTracks = false
      p.audioTracks.forEach((value, _) => {
        if (value.on) {
          anyAudioTracks = true
        }
      })
      var anyVideoTracks = false
      p.videoTracks.forEach((value, _) => {
        if (value.on) {
          anyVideoTracks = true
        }
      })
      if (anyAudioTracks || anyVideoTracks) {
        return (
          <div key={`stream-wrapper-${p.identity}`}>
            <NameView userId={p.identity} id={`stream-nameview-${p.identity}`} />:
            <ParticipantTracks participant={p} />
          </div>
        )
      } else {
        return null
      }
    }).filter(p => p)
    if (liveTracks.length > 0) {
      otherVideos = liveTracks
    }
  }

  return (
    <div id="media-view">
      {playerVideo} {mediaSelector} {otherVideos}
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
