import * as React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import * as Twilio from 'twilio-video'
import { DispatchContext } from '../App'

import { fetchTwilioToken, setNetworkMediaChatStatus } from '../networking'
import { setUpSpeechRecognizer, stopSpeechRecognizer } from '../speechRecognizer'
import { DeviceInfo, MediaChatContext, Participant } from './mediaChatContext'
import ParticipantTracks from './twilio/ParticipantTracks'
import VideoTrack from './twilio/VideoTrack'

export const TwilioChatContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const dispatch = useContext(DispatchContext)

  const [token, setToken] = useState<string>()
  const [roomId, setRoomId] = useState<string>()
  const [room, setRoom] = useState<Twilio.Room>()

  const [micEnabled, setMicEnabled] = useState<boolean>(true)
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true)

  const [cameras, setCameras] = useState<DeviceInfo[]>([])
  const [mics, setMics] = useState<DeviceInfo[]>([])

  const [currentMic, setCurrentMic] = useState<DeviceInfo>()
  const [currentCamera, setCurrentCamera] = useState<DeviceInfo>()

  // These are separate from current to handle the case of the media selector
  // where we need both mic and camera enabled, but may not want to show
  // the camera in the background
  const [publishingCamera, setPublishingCamera] = useState<boolean>()
  const [publishingMic, setPublishingMic] = useState<boolean>()

  const [remoteParticipants, setRemoteParticipants] = useState<Map<String, Twilio.Participant>>()

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
    console.log('[TWILIO] Fetching local video track')
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

    if (publishingCamera) {
      publishVideo()
    }
  }

  const startTranscription = () => {
    if (!currentMic) return
    setUpSpeechRecognizer(currentMic.id, dispatch)
  }

  const stopTranscription = () => {
    stopSpeechRecognizer()
  }

  const publishMedia = () => {
    publishAudio()
    publishVideo()
  }

  const publishAudio = () => {
    setNetworkMediaChatStatus(true)
    setPublishingMic(true)

    if (room) {
      if (localAudioTrack) {
        room.localParticipant.publishTrack(localAudioTrack)
        localAudioTrack.restart()
        startTranscription()
      }
    }
  }

  const publishVideo = () => {
    setNetworkMediaChatStatus(true)
    setPublishingCamera(true)

    if (localVideoTrack) {
      room.localParticipant.publishTrack(localVideoTrack)
      localVideoTrack.restart()

      if (!localStreamView) {
        setLocalStreamView(<VideoTrack track={localVideoTrack} />)
      }
    }
  }

  const unpublishMedia = () => {
    setNetworkMediaChatStatus(false)
    setPublishingCamera(false)
    setPublishingMic(false)

    if (room) {
      if (localAudioTrack) {
        room.localParticipant.unpublishTrack(localAudioTrack)
        localAudioTrack.stop()
        stopSpeechRecognizer()
      }

      if (localVideoTrack) {
        room.localParticipant.unpublishTrack(localVideoTrack)
        localVideoTrack.stop()
      }
    }

    setLocalStreamView(undefined)
  }

  useEffect(() => {
    console.log('[TWILIO] In useeffect for camera')
    if (!currentCamera) return
    console.log('[TWILIO] Has camera')
    fetchLocalVideoTrack()
  }, [currentCamera])

  useEffect(() => {
    if (!currentMic) return
    fetchLocalAudioTrack()

    if (micEnabled) {
      startTranscription()
    } else {
      stopTranscription()
    }
  }, [currentMic])

  useEffect(() => {
    if (micEnabled) {
      startTranscription()
    } else {
      stopTranscription()
    }
  }, [micEnabled])

  useEffect(() => {
    console.log('[TWILIO] In token roomId useEffect')
    // The initial token might get set after calling joinCall
    // This calls joinCall when we're ready after that initial setup
    if (token && roomId && !room) {
      console.log('[TWILIO] Joining room')
      joinCall(roomId)
    }
  }, [token, roomId])

  async function prepareForMediaChat () {
    if (token) return
    return fetchTwilioToken()
      .then((token) => { setToken(token) })
  }

  async function prepareMediaDevices () {
    const mapToDeviceInfo = (d: MediaDeviceInfo): DeviceInfo => {
      console.log(d)
      return {
        id: d.deviceId,
        name: d.label
      }
    }

    try {
      // This is just to try to force the prompt early enough
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      await navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          console.log('[TWILIO] Fetched devices')

          const cameras = devices
            .filter(d => d.kind === 'videoinput')
            .map(mapToDeviceInfo)

          const mics = devices
            .filter(d => d.kind === 'audioinput')
            .map(mapToDeviceInfo)

          setCameras(cameras)
          setMics(mics)

          console.log('[TWILIO] Setting current camera', cameras[0])
          setCurrentCamera(cameras[0])
          setCurrentMic(mics[0])
        })
    } catch (e) {
      console.log('[TWILIO] Error fetching media devices', e)
    }
  }

  async function joinCall (roomId: string) {
    // A useEffect hook will re-call this once the token exists
    if (!token) {
      setRoomId(roomId)
      return
    }

    // We're real sloppy re: calling this multiple times
    if (room && room.name === roomId) return

    if (room && room.name !== roomId) {
      // Remove from previous room
      room.disconnect();
    }

    try {
      const opts: Twilio.ConnectOptions = {
        name: roomId,
        tracks: [],
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
      }

      if (localVideoTrack) {
        // This cast shouldn't be necessary, but I'm not sure how to fix it
        // (Because we define tracks as [] above, TS doesn't know if it's
        // LocalTrack[] or MediaStreamTrack[])
        (opts.tracks as Twilio.LocalTrack[]).push(localVideoTrack)
      }

      if (localAudioTrack) {
        (opts.tracks as Twilio.LocalTrack[]).push(localAudioTrack)
      }

      const room = await Twilio.connect(token, opts)

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

      console.log('[TWILIO] In room?', room)
      console.log('[TWILIO] Attached participant count:', room.participants.size)

      setLocalStreamView(<ParticipantTracks participant={room.localParticipant}/>)
      setRemoteParticipants(room.participants)

      room.on('participantConnected', () => { setRemoteParticipants(room.participants) })

      room.on('participantDisconnected', () => { setRemoteParticipants(room.participants) })

      window.addEventListener('beforeunload', (event) => {
        room.disconnect()
      })

      setRoom(room)
    } catch (e) {
      console.log('[TWILIO] Could not connect to room', e)
    }
  }

  function leaveCall () {
    console.log('[TWILIO] In leave call', localVideoTrack)
    if (room) room.disconnect()
    if (localVideoTrack) localVideoTrack.stop()
    if (localAudioTrack) localAudioTrack.stop()
    stopTranscription()
  }

  return (
    <MediaChatContext.Provider
      value={{
        prepareForMediaChat,
        prepareMediaDevices,

        cameras,
        mics,

        currentMic,
        currentCamera,

        publishingCamera,
        publishingMic,

        // TODO: Should this function be moved elsewhere?
        // Should this logic live in a useEffect hook?
        setCurrentCamera: (id: string) => {
          console.log('Setting current camera', id, currentCamera, currentCamera.id)
          if (currentCamera && currentCamera.id !== id) {
            console.log('Removing old camera', room)
            if (room) {
              // TODO: room.unpublishTrack(localVideoTrack) wasn't working for some reason
              // This blunt approach works for now, but will need changing if we
              // e.g. add in screen sharing
              room.localParticipant.videoTracks.forEach(publication => {
                publication.unpublish()
              })
            }
          }
          setCurrentCamera(cameras.find(c => c.id === id))
        },
        setCurrentMic: (id: string) => {
          if (currentMic && currentMic.id !== id) {
            if (room) {
              room.localParticipant.audioTracks.forEach(publication => {
                publication.unpublish()
              })
            }
          }
          setCurrentMic(mics.find(c => c.id === id))
        },

        localStreamView,

        publishMedia,
        unpublishMedia,
        publishAudio,

        joinCall,
        leaveCall,

        callParticipants: remoteParticipants,

        micEnabled,
        setMicEnabled: (enabled: boolean) => {
          setMicEnabled(enabled)
          if (!room) return

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
