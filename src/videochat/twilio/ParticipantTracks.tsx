
import React from 'react'
import { Participant, Track } from 'twilio-video'
import Publication from './Publication'
import usePublications from './usePublications'

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

  return (
    <>
      {
        publications.map(publication => {
          if ((publication.kind === 'video' && displayVideo) || (publication.kind === 'audio' && displayAudio)) {
            return <Publication
              key={publication.kind}
              publication={publication}
              isLocalParticipant={isLocalParticipant}
              videoOnly={videoOnly}
              videoPriority={videoPriority}
            />
          } else {
            return null
          }
        }
        )
      }
    </>
  )
}
