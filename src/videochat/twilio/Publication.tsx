import React from 'react'
import useTrack from './useTrack'
import AudioTrack from './AudioTrack'
import VideoTrack from './VideoTrack'

import {
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  RemoteTrackPublication,
  RemoteVideoTrack,
  Track
} from 'twilio-video'

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  isLocalParticipant?: boolean;
  videoOnly?: boolean;
  videoPriority?: Track.Priority | null;
}

export default function Publication ({ publication, isLocalParticipant, videoOnly, videoPriority }: PublicationProps) {
  const track = useTrack(publication)

  if (!track) return null

  switch (track.kind) {
    case 'video':
      return (
        <VideoTrack
          track={track as LocalVideoTrack|RemoteVideoTrack}
          priority={videoPriority}
          isLocal={track.name.includes('camera') && isLocalParticipant}
        />
      )
    case 'audio':
      return videoOnly ? null : <AudioTrack track={track as IAudioTrack} />
    default:
      return null
  }
}
