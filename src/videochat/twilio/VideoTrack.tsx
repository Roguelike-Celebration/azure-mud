
import React, { useRef, useEffect } from 'react'
import { LocalVideoTrack, RemoteVideoTrack, Track } from 'twilio-video'
import useMediaStreamTrack from './useMediaStreamTrack'
import useVideoTrackDimensions from './useVideoTrackDimensions'

interface VideoTrackProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack ({ track, isLocal, priority }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!)
  const mediaStreamTrack = useMediaStreamTrack(track)
  const dimensions = useVideoTrackDimensions(track)
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0)
  console.log('Rendering videotrack', track)
  useEffect(() => {
    const el = ref.current
    el.muted = true
    if ((track as RemoteVideoTrack).setPriority && priority) {
      (track as RemoteVideoTrack).setPriority(priority)
    }
    track.attach(el)
    return () => {
      track.detach(el)
      if ((track as RemoteVideoTrack).setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        (track as RemoteVideoTrack).setPriority(null)
      }
    }
  }, [track, priority, mediaStreamTrack])

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment'
  const style = {
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
    objectFit: isPortrait || track.name.includes('screen') ? ('contain' as const) : ('cover' as const)
  }

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video ref={ref} style={style} />
}
