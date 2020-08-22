import React, {
  useEffect,
  VideoHTMLAttributes,
  useRef,
  useContext
} from 'react'
import NameView from './NameView'
import { otherMediaStreams } from '../webRTC'
import LocalMediaView from './LocalMediaView'
import { DispatchContext } from '../App'

import '../../style/videoChat.css'

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  peerIds?: string[];
  localMediaStreamId?: string;

  speakingPeerIds: string[];

  videoDeviceId?: string;
  audioDeviceId?: string;
}

export default function MediaChatView (props: MediaProps) {
  let otherVideos, mediaSelector
  const dispatch = useContext(DispatchContext)
  console.log('Re-rendering media chat view?')

  const playerVideo = (
    <LocalMediaView speaking={props.speakingPeerIds.includes('self')} />
  )

  if (props.peerIds) {
    // We don't actually use `peerIds` other than as a way to force the component to update.
    // That might change?
    otherVideos = Object.entries(otherMediaStreams()).map(
      ([peerId, stream]) => {
        return (
          <div key={`stream-wrapper-${peerId}`}>
            <NameView userId={peerId} id={`stream-nameview-${peerId}`} />:
            <Video
              srcObject={stream}
              id={`stream-${peerId}`}
              className={
                props.speakingPeerIds.includes(peerId) ? 'speaking' : ''
              }
            />
          </div>
        )
      }
    )
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

export function Video ({ srcObject, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return
    console.log(srcObject)
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  return <video ref={refVideo} {...props} autoPlay /> // eslint-disable-line jsx-a11y/media-has-caption
}
