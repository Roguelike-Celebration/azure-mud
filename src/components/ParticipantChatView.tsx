import React from 'react'
import { FaUser, FaVideo, FaVideoSlash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import * as Twilio from 'twilio-video'

import ParticipantTracks from '../videochat/twilio/ParticipantTracks'

import NameView from './NameView'

import '../../style/videoChat.css'

interface Props {
  participant: Twilio.Participant
  isDominant: boolean
  renderAsFace: boolean
}

export default function ParticipantChatView (props: Props) {
  const [playVideo, setPlayVideo] = React.useState<boolean>(props.renderAsFace)
  const [playAudio, setPlayAudio] = React.useState<boolean>(true)

  const toggleVideo = () => {
    setPlayVideo(!playVideo)
  }

  const toggleAudio = () => {
    setPlayAudio(!playAudio)
  }

  const customStyle = {
    border: props.isDominant ? 'solid' : undefined
  }

  if (!props.renderAsFace) {
    return (
      <ParticipantTracks
        participant={props.participant}
        displayVideo={false}
        displayAudio={playAudio}
      />
    )
  }

  const hasVideoTracks = props.participant.videoTracks.size > 0
  const hasAnyTracks = props.participant.audioTracks.size + props.participant.videoTracks.size > 0

  if (!hasAnyTracks) {
    return <div key={`stream-wrapper-${props.participant.identity}`} />
  }

  let placeholderAvatar
  if (!playVideo || !hasVideoTracks) {
    placeholderAvatar = <FaUser size={90} style={{ textAlign: 'center' }} className='placeholder-avatar'/>
  }

  return (
    <div key={`stream-wrapper-${props.participant.identity}`} className='participant-track-square other-participant' style={customStyle}>
      <NameView userId={props.participant.identity} id={`stream-nameview-${props.participant.identity}`} nowrap={true} />
      <ParticipantTracks participant={props.participant} displayVideo={playVideo} displayAudio={playAudio} />
      {hasVideoTracks
        ? <button id='play-video'
          onClick={toggleVideo}
          className={`link-styled-button video-button ${playVideo ? 'enabled' : 'disabled'}`}
          aria-label={`Toggle Video ${props.participant.identity}`}>
          {playVideo ? <FaVideo /> : <FaVideoSlash />}
        </button>
        : null}
      {placeholderAvatar}
      <button id='play-audio'
        onClick={toggleAudio}
        className={`link-styled-button video-button ${playAudio ? 'enabled' : 'disabled'}`}
        aria-label={`Toggle Audio ${props.participant.identity}`}>
        {playAudio ? <FaVolumeUp /> : <FaVolumeMute />}
      </button>
    </div>
  )
}
