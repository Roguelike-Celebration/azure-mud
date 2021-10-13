import React, {
  useEffect,
  VideoHTMLAttributes,
  useRef
} from 'react'
import { FaCog, FaVolumeUp, FaVolumeMute, FaVideo, FaVideoSlash } from 'react-icons/fa'
import NameView from './NameView'
import LocalMediaView from './LocalMediaView'

import '../../style/videoChat.css'
import { useMediaChatContext } from '../videochat/mediaChatContext'
import ParticipantTracks from '../videochat/twilio/ParticipantTracks'
import * as Twilio from 'twilio-video'

interface Props {
  participant: Twilio.Participant
  isDominant: boolean
  renderAsFace: boolean
}

export default function ParticipantChatView (props: Props) {
  const [playVideo, setPlayVideo] = React.useState<boolean>(props.renderAsFace)
  const [playAudio, setPlayAudio] = React.useState<boolean>(true)

  const onChangeVideo = (e) => {
    setPlayVideo(!playVideo)
  }

  const onChangeAudio = (e) => {
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

  const hasAnyTracks = props.participant.audioTracks.size + props.participant.videoTracks.size > 0
  if (!hasAnyTracks) {
    return <div key={`stream-wrapper-${props.participant.identity}`} />
  }

  return (
    <div key={`stream-wrapper-${props.participant.identity}`} className='participant-track-square' style={customStyle}>
      <NameView userId={props.participant.identity} id={`stream-nameview-${props.participant.identity}`} nowrap={true} />
      <ParticipantTracks participant={props.participant} displayVideo={playVideo} displayAudio={playAudio} />
      <button id='play-video'
        onClick={onChangeVideo}
        className={`link-styled-button video-button ${playVideo ? 'enabled' : 'disabled'}`}
        aria-label={`Toggle Video ${props.participant.identity}`}>
        {playVideo ? <FaVideo /> : <FaVideoSlash />}
      </button>
      <button id='play-audio'
        onClick={onChangeAudio}
        className={`link-styled-button video-button ${playAudio ? 'enabled' : 'disabled'}`}
        aria-label={`Toggle Audio ${props.participant.identity}`}>
        {playAudio ? <FaVolumeUp /> : <FaVolumeMute />}
      </button>
    </div>
  )
}
