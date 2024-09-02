
import React from 'react'
import { Participant, Track } from 'twilio-video'
import Publication from './Publication'
import usePublications, { TrackPublication } from './usePublications'

interface ParticipantTracksProps {
  participant: Participant;
  // These handle whether the video/audio is run on the client-side only - they don't change the underlying tracks
  displayVideo: boolean;
  displayAudio: boolean;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
  isLocalParticipant?: boolean;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

// TODO: This should handle mute

export default function ParticipantTracks ({
  participant,
  displayVideo,
  displayAudio,
  videoOnly,
  videoPriority,
  isLocalParticipant
}: ParticipantTracksProps) {
  const publications = usePublications(participant)
  const videoPublications = publications.filter(p => p.kind === 'video')
  const audioPublications = publications.filter(p => p.kind === 'audio')

  let finalPublications: TrackPublication[] = []

  if (displayVideo && videoPublications.length > 0) {
    finalPublications.push(videoPublications[0])
  }

  if (displayAudio) {
    finalPublications = finalPublications.concat(audioPublications)
  }

  return (
    <>
      {
        finalPublications.map(publication => {
          return <Publication
            key={publication.kind}
            publication={publication}
            isLocalParticipant={isLocalParticipant}
            videoOnly={videoOnly}
            videoPriority={videoPriority}
          />
        })
      }
    </>
  )
}
