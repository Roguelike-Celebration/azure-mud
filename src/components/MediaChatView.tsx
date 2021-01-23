import React, {
  useEffect,
  VideoHTMLAttributes,
  useRef,
  useContext,
  useState
} from 'react'
import NameView from './NameView'
import LocalMediaView from './LocalMediaView'
import { DispatchContext } from '../App'

import '../../style/videoChat.css'
import { Renderer, LocalVideoStream, RemoteVideoStream } from '@azure/communication-calling'
import { useUserCallSettingsContext } from '../acs/useUserCallSettings'
import { useActiveCallContext } from '../acs/useActiveCallContext'

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  // All peers that the server considers to be 'in' videochat
  peerIds?: string[];

  speakingPeerIds: string[];
}

export default function MediaChatView (props: MediaProps) {
  let mediaSelector
  const dispatch = useContext(DispatchContext)
  const { remoteParticipants } = useActiveCallContext()
  console.log('Re-rendering media chat view?')

  const playerVideo = (
    <LocalMediaView speaking={props.speakingPeerIds.includes('self')}/>
  )

  const otherVideos = remoteParticipants.map((p) => {
    return (
      <div key={`stream-wrapper-${p.displayName}`}>
        <NameView userId={p.displayName} id={`stream-nameview-${p.displayName}`} />:
        <AcsVideo
          // TODO: Select correct stream?
          videoStream={p.videoStreams[0]}
          // id={`stream-${peerId}`}
          // className={
          //   props.speakingPeerIds.includes(peerId) ? 'speaking' : ''
          // }
        />
      </div>
    )
  })

  return (
    <div id="media-view">
      {playerVideo} {mediaSelector} {otherVideos}
    </div>
  )
}

export function AcsVideo (props: {videoStream: LocalVideoStream|RemoteVideoStream}) {
  const { videoStream } = props
  const vidRef = useRef<HTMLDivElement>(null)
  const [renderer, setRenderer] = useState<Renderer>()

  useEffect(() => {
    if (videoStream && !renderer) {
      setRenderer(new Renderer(videoStream))
    }
  }, [videoStream, renderer])

  useEffect(() => {
    if (renderer) {
      renderer.createView().then((view) => {
        vidRef.current!.appendChild(view.target)
      })
    }

    return () => {
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [renderer, vidRef])

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
