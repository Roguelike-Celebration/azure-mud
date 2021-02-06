import * as React from 'react'
import { useState, useEffect } from 'react'
import * as Twilio from 'twilio-video'

import { fetchTwilioToken } from '../networking'
import { DeviceInfo, MediaChatContext, Participant } from './mediaChatContext'
import ParticipantTracks from './twilio/ParticipantTracks'
import VideoTrack from './twilio/VideoTrack'

export const TwilioChatContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string>()
  const [room, setRoom] = useState<Twilio.Room>()

  const [micEnabled, setMicEnabled] = useState<boolean>()
  const [cameraEnabled, setCameraEnabled] = useState<boolean>()

  const [cameras, setCameras] = useState<DeviceInfo[]>([])
  const [mics, setMics] = useState<DeviceInfo[]>([])

  const [currentMic, setCurrentMic] = useState<DeviceInfo>()
  const [currentCamera, setCurrentCamera] = useState<DeviceInfo>()

  const [remoteParticipants, setRemoteParticipants] = useState<Participant[]>([])

  const [localVideoTrack, setLocalVideoTrack] = useState<Twilio.LocalVideoTrack>()
  const [localAudioTrack, setLocalAudioTrack] = useState<Twilio.LocalAudioTrack>()

  const [localStreamView, setLocalStreamView] = useState<React.ReactNode>()

  const fetchLocalAudioTrack = async () => {
    const trackObj: any = {}
    if (currentMic) {
      trackObj.audio = { deviceId: currentMic.id }
    }

    const track = await Twilio.createLocalAudioTrack(trackObj)
    setLocalAudioTrack(track)
  }

  const fetchLocalVideoTrack = async () => {
    const options: Twilio.CreateLocalTrackOptions = { // TODO: Shrink size if mobile
      height: 720,
      frameRate: 24,
      width: 1280
    }

    if (currentCamera) {
      options.deviceId = { exact: currentCamera.id }
    }

    const track = await Twilio.createLocalVideoTrack(options)
    setLocalVideoTrack(track)
    setLocalStreamView(<VideoTrack track={track} />)
  }

  useEffect(() => { fetchLocalVideoTrack() }, [currentCamera])
  useEffect(() => { fetchLocalAudioTrack() }, [currentMic])

  async function prepareForMediaChat () {
    console.log('Preparing for media chat')
    // TODO: one-line this once I know what the output looks like
    const fetchToken = fetchTwilioToken()
      .then((token) => {
        console.log(token)
        setToken(token)
      })

    const mapToDeviceInfo = (d: MediaDeviceInfo): DeviceInfo => {
      return {
        id: d.deviceId,
        name: d.label
      }
    }
    const fetchDevices = navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        console.log('Fetched devices')
        setCameras(devices
          .filter(d => d.kind === 'videoinput')
          .map(mapToDeviceInfo))

        setMics(devices
          .filter(d => d.kind === 'audioinput')
          .map(mapToDeviceInfo))

        setCurrentCamera(cameras[0])
        setCurrentMic(mics[0])
      })

    return Promise.all([fetchToken, fetchDevices])
  }

  async function joinCall (roomId: string) {
    try {
      const room = await Twilio.connect(token, {
        name: roomId,
        tracks: [localAudioTrack, localVideoTrack],
        maxAudioBitrate: 16000, // For music remove this line
        bandwidthProfile: {
          video: {
            mode: 'grid',
            maxTracks: 10,
            renderDimensions: {
              high: { height: 1080, width: 1920 },
              standard: { height: 720, width: 1280 },
              low: { height: 176, width: 144 }
            }
          }
        },
        preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }]
      })

      // TODO: I worry this will send a single video/audio frame if disabled on start? To test
      room.localParticipant.videoTracks.forEach(publication => {
        if (cameraEnabled) {
          publication.track.enable()
        } else {
          publication.track.disable()
        }
      })

      room.localParticipant.audioTracks.forEach(publication => {
        if (micEnabled) {
          publication.track.enable()
        } else {
          publication.track.disable()
        }
      })

      const addParticipant = (participant: Twilio.Participant) => {
        const p: Participant = {
          userId: participant.identity,
          muted: false, // TODO
          streamView: <ParticipantTracks participant={participant} />
        }
        console.log('Adding participant', participant, p)

        participant.on('trackSubscribed', track => {
          console.log('Track subscribed', track)
          // This should ideally not mutate, but I don't know what happens if we try to deep-copy React nodes
          const i = remoteParticipants.findIndex(p => p.userId === participant.identity)
          if (i !== -1) {
            remoteParticipants[i] = p
            setRemoteParticipants(remoteParticipants)
          } else {
            setRemoteParticipants(remoteParticipants.concat([p]))
          }
        })

        // TODO: These two events are what will let us remove disabled video streams
        // There's rendering logic to sort out here (how do we update components?)
        // Presumably, we should show someone differently if they have only audio or neither audio nor video

        // participant.on('trackDisabled', track => {
        //   setRemoteParticipants(remoteParticipants)
        // })

        // participant.on('trackEnabled', track => {
        //   setRemoteParticipants(remoteParticipants)
        // })

        setRemoteParticipants(remoteParticipants.concat([p]))

        // TODO: Handle mute/unmute events for each track
      }

      console.log('In room?', room)
      setLocalStreamView(<ParticipantTracks participant={room.localParticipant}/>)
      room.participants.forEach(addParticipant)
      room.on('participantConnected', addParticipant)

      room.on('participantDisconnected', (participant: Twilio.Participant) => {
        setRemoteParticipants(remoteParticipants
          .filter(p => p.userId !== participant.identity))
      })

      setRoom(room)
    } catch (e) {
      console.log('Could not connect to room', e)
    }
  }

  return (
    <MediaChatContext.Provider
      value={{
        prepareForMediaChat,

        cameras,
        mics,

        currentMic,
        currentCamera,

        setCurrentCamera: (id: string) => setCurrentCamera(cameras.find(c => c.id === id)),
        setCurrentMic: (id: string) => setCurrentMic(mics.find(c => c.id === id)),

        localStreamView,

        joinCall,
        leaveCall: () => room.disconnect(),

        callParticipants: remoteParticipants,

        micEnabled,
        setMicEnabled: (enabled: boolean) => {
          setMicEnabled(enabled)
          if (room) return

          room.localParticipant.audioTracks.forEach(publication => {
            if (enabled) {
              publication.track.enable()
            } else {
              // TODO: Might want to stop/unpublish
              // to turn off light
              publication.track.disable()
            }
          })
        },

        cameraEnabled,
        setCameraEnabled: (enabled: boolean) => {
          setCameraEnabled(enabled)
          if (!room) return

          room.localParticipant.videoTracks.forEach(publication => {
            if (enabled) {
              publication.track.enable()
            } else {
              publication.track.disable()
            }
          })
        }
      }}
    >
      {props.children}
    </MediaChatContext.Provider>
  )
}
