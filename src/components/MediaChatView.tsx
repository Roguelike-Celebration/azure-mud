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
import { LocalVideoStream, RemoteVideoStream, Renderer, VideoDeviceInfo } from '@azure/communication-calling'

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  // All peers that the server considers to be 'in' videochat
  peerIds?: string[];

  // All peers who have open WebRTC streams
  // We don't (as of writing this) use this data in logic, but tracking it as a
  // prop lets React auto-rerender this component when a new stream is opened
  connectedPeerIds?: string[];

  speakingPeerIds: string[];

  videoDeviceId?: string;
  audioDeviceId?: string;
  cameraDevices?: VideoDeviceInfo[]
}

export default function MediaChatView (props: MediaProps) {
  let otherVideos, mediaSelector
  const dispatch = useContext(DispatchContext)
  console.log('Re-rendering media chat view?')

  const playerVideo = (
    <LocalMediaView speaking={props.speakingPeerIds.includes('self')} cameraDevices={props.cameraDevices} videoId={props.videoDeviceId}/>
  )

  if (props.peerIds) {
    console.log(props.peerIds)
    const otherStreams = otherMediaStreams()
    otherVideos = props.peerIds.map((peerId) => {
      const stream = otherStreams[peerId]
      if (!stream) return null
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
    }).filter(el => !!el)
  }

  return (
    <div id="media-view">
      {playerVideo} {mediaSelector} {otherVideos}
    </div>
  )
}

type AcsVideoProps = {
  src: LocalVideoStream|RemoteVideoStream
}

export function AcsVideo ({ src }: AcsVideoProps) {
  const vidRef = useRef<HTMLDivElement>(null)
  const renderer = new Renderer(src)

  useEffect(() => {
    if (!vidRef.current) return
    if (!renderer) return

    renderer.createView().then(view => {
      vidRef.current!.appendChild(view.target)
    })
  }, [src])

  return (
    <div ref={vidRef}></div>
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
