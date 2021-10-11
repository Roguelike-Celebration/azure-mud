import React, {
  useEffect,
  VideoHTMLAttributes,
  useRef
} from 'react'
import LocalMediaView from './LocalMediaView'
import { DominantSpeakerData } from '../reducer'

import '../../style/videoChat.css'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import * as Twilio from 'twilio-video'
import ParticipantChatView from './ParticipantChatView'

// TODO: We should allow you to not send media but still consume it
interface MediaProps {
  dominantSpeakerData?: DominantSpeakerData;
}

// Collapses repeated calls during the duration to occur only once, [ms] ms after the last invocation of the wrapper.
function rateLimit (fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn()
    }, ms)
  }
}

function hasAnyLiveTracks (participant: Twilio.Participant): boolean {
  var anyAudioTracks = false
  participant.audioTracks.forEach((value, _) => {
    if (value.on) {
      anyAudioTracks = true
    }
  })
  var anyVideoTracks = false
  participant.videoTracks.forEach((value, _) => {
    if (value.on) {
      anyVideoTracks = true
    }
  })
  return anyAudioTracks || anyVideoTracks
}

interface ParticipantInfo {
  id: string;
  lastDominant: number
}

export default function MediaChatView (props: MediaProps) {
  // TODO: Figure out how to tie this into the css or something?
  const ROW_HEIGHT = 195
  const FEED_WIDTH = 180

  const { publishingCamera, callParticipants } = useMediaChatContext()
  const ref = useRef(null)

  const [spaceFor, setSpaceFor] = React.useState<number>(0)
  const [numHiddenFeeds, setNumHiddenFeeds] = React.useState<number>(0)
  // This is effectively set to 1, since I removed the buttons to let the user control it
  const [rowsToDisplay, setRowsToDisplay] = React.useState<number>(1)
  const [participantsWithTracksOrdered] = React.useState<ParticipantInfo[]>([])

  console.log('Re-rendering media chat view?')

  useEffect(() => {
    function onResize () {
      const renderedWidth = ref.current.clientWidth
      const renderedHeight = ref.current.clientHeight
      const collection: HTMLCollection = ref.current.children

      const numRows = Math.floor(renderedHeight / ROW_HEIGHT)
      const shownPerRow = Math.floor(renderedWidth / FEED_WIDTH)
      const currentSpaceFor = numRows * shownPerRow

      setSpaceFor(currentSpaceFor)
      setNumHiddenFeeds(Math.max(0, collection.length - currentSpaceFor))
    }

    onResize()
    const limitedOnResize = rateLimit(onResize, 100)

    window.addEventListener('resize', limitedOnResize)
    return () => window.removeEventListener('resize', limitedOnResize)
  })

  let playerVideo: JSX.Element
  if (publishingCamera) {
    playerVideo = (
      // TODO: To make this work, find the client's participantId
      <LocalMediaView speaking={false}/>
    )
  }

  let otherVideos: JSX.Element[]
  console.log(callParticipants)
  if (callParticipants) {
    // Build a map of live participant ids -> Element
    const tracksByParticipant: Map<string, JSX.Element> = new Map()
    Array.from(callParticipants.values())
      .filter(hasAnyLiveTracks)
      .map((p) => {
        tracksByParticipant.set(p.identity, (
          <ParticipantChatView participant={p} isDominant={props.dominantSpeakerData.dominantSpeakerId === p.identity} />
        ))
      })

    // Assign the tracks to positions, noting where we put the dominant speaker
    const unassignedIds = new Set<string>(tracksByParticipant.keys())
    const dominantSpeakerId = props.dominantSpeakerData.dominantSpeakerId
    var dominantSpeakerIdx = 0
    const nowMs = Date.now()

    // Remove all tracks we don't need from the participants list
    const toRemove = []
    for (var i = 0; i < participantsWithTracksOrdered.length; i++) {
      const oldId = participantsWithTracksOrdered[i].id
      if (unassignedIds.has(oldId)) {
        unassignedIds.delete(oldId)
        if (oldId === dominantSpeakerId) {
          dominantSpeakerIdx = i
          participantsWithTracksOrdered[i].lastDominant = nowMs
        }
      } else {
        toRemove.push(oldId)
      }
    }
    toRemove.forEach((id) => participantsWithTracksOrdered.splice(participantsWithTracksOrdered.indexOf(id), 1))

    // Slap anything left over onto the end
    unassignedIds.forEach((unassignedId) => {
      if (unassignedId === dominantSpeakerId) {
        dominantSpeakerIdx = participantsWithTracksOrdered.length
        participantsWithTracksOrdered.push({ id: unassignedId, lastDominant: nowMs })
      } else {
        participantsWithTracksOrdered.push({ id: unassignedId, lastDominant: 0 })
      }
    })

    // If the dominant speaker is not in the frame, evict the oldest item in the frame
    const spacesAvailable = publishingCamera ? spaceFor - 1 : spaceFor

    if (dominantSpeakerIdx >= spacesAvailable) {
      var lastDominantComp = nowMs
      var evictIdx = 0
      for (var j = 0; j < spacesAvailable; j++) {
        const participant = participantsWithTracksOrdered[j]
        if (participant.lastDominant < lastDominantComp) {
          lastDominantComp = participant.lastDominant
          evictIdx = j
        }
      }
      const dominantInfo = participantsWithTracksOrdered[dominantSpeakerIdx]
      participantsWithTracksOrdered[dominantSpeakerIdx] = participantsWithTracksOrdered[evictIdx]
      participantsWithTracksOrdered[evictIdx] = dominantInfo
    }

    if (tracksByParticipant.size > 0) {
      otherVideos = participantsWithTracksOrdered.map((participantInfo) => tracksByParticipant.get(participantInfo.id))
    }
  }

  // Test code
  /*
  otherVideos = []
  for (var i = 0; i < 21; i++) {
    otherVideos[i] = (
      <LocalMediaView speaking={false}/>
    )
  } */

  return (
    <div>
      <label>{otherVideos ? otherVideos.length : 0} other chatters ({numHiddenFeeds} offscreen). </label>
      <div id="media-view" ref={ref} style={{ height: rowsToDisplay * ROW_HEIGHT, maxHeight: rowsToDisplay * ROW_HEIGHT }}>
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
