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
import { JsxElement } from 'typescript'

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  // All peers that the server considers to be 'in' videochat
  peerIds?: string[];

  speakingPeerIds: string[];
}

// Collapses repeated calls during the duration to occur only once, [ms] ms after the last invocation of the wrapper.
function rateLimit(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn()
    }, ms)
  };
}

export default function MediaChatView (props: MediaProps) {
  // TODO: Figure out how to tie this into the css or something?
  const ROW_HEIGHT = 195
  const FEED_WIDTH = 180

  const { publishingCamera, callParticipants } = useMediaChatContext()
  const ref = useRef(null)

  const [numHiddenFeeds, setNumHiddenFeeds] = React.useState<number>(0)
  const [rowsToDisplay, setRowsToDisplay] = React.useState<number>(1)

  console.log('Re-rendering media chat view?')

  useEffect(() => {
    function onResize () {
      const renderedWidth = ref.current.clientWidth
      const renderedHeight = ref.current.clientHeight
      const collection: HTMLCollection = ref.current.children

      const numRows = Math.floor(renderedHeight / ROW_HEIGHT)
      const shownPerRow = Math.floor(renderedWidth / FEED_WIDTH)
      const spaceFor = numRows * shownPerRow

      setNumHiddenFeeds(Math.max(0, collection.length - spaceFor))
    }

    onResize()
    const limitedOnResize = rateLimit(onResize, 100)

    window.addEventListener('resize', limitedOnResize)
    return () => window.removeEventListener('resize', limitedOnResize)
  })

  let playerVideo: JSX.Element
  if (publishingCamera) {
    playerVideo = (
      <LocalMediaView speaking={props.speakingPeerIds.includes('self')}/>
    )
  }

  let otherVideos: JSX.Element[]
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
          <div key={`stream-wrapper-${p.identity}`} className='participant-track-square'>
            <NameView userId={p.identity} id={`stream-nameview-${p.identity}`} />
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

  // Test code
  /*
  otherVideos = []
  for (var i = 0; i < 21; i++) {
    otherVideos[i] = (
      <LocalMediaView speaking={props.speakingPeerIds.includes('self')}/>
    )
  }*/

  return (
    <div>
      <label>{otherVideos ? otherVideos.length : 0} other chatters ({numHiddenFeeds} offscreen). </label>
      <button onClick={() => setRowsToDisplay(rowsToDisplay + 1)}>Show More</button>
      <button onClick={() => setRowsToDisplay(Math.max(0, rowsToDisplay - 1))}>Show Less</button>
      <div id="media-view" ref={ref} style={{height: rowsToDisplay * ROW_HEIGHT, maxHeight: rowsToDisplay * ROW_HEIGHT}}>
          {playerVideo} {otherVideos}
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
