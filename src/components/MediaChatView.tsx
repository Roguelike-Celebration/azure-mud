import React, {
  useEffect,
  VideoHTMLAttributes,
  useRef
} from 'react'
import NameView from './NameView'
import LocalMediaView from './LocalMediaView'

import '../../style/videoChat.css'
import { useMediaChatContext } from '../videochat/mediaChatContext'

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

  console.log(callParticipants)
  const otherVideos = (callParticipants || []).map((p) => {
    return (
      <div key={`stream-wrapper-${p.userId}`}>
        <NameView userId={p.userId} id={`stream-nameview-${p.userId}`} />:
        {p.streamView}
      </div>
    )
  })

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
