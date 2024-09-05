import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import * as Twilio from 'twilio-video'
import { HideModalAction, MediaReceivedSpeakingDataAction, RefreshReactAction, StartVideoChatAction, StopVideoChatAction } from '../Actions'

import { DispatchContext } from '../App'

import { fetchTwilioToken } from '../networking'
import { setUpSpeechRecognizer, stopSpeechRecognizer } from '../speechRecognizer'
import { DeviceInfo, MediaChatContext } from './mediaChatContext'
import ParticipantTracks from './twilio/ParticipantTracks'
import VideoTrack from './twilio/VideoTrack'

export const TwilioChatContextProvider = (props: {
  active: boolean;
  children: React.ReactNode;
}) => {
  const dispatch = useContext(DispatchContext)

  const [token, setToken] = useState<string>()
  const [roomId, setRoomId] = useState<string>()
  const [room, setRoom] = useState<Twilio.Room>()
  const [joinCallFailed, setJoinCallFailed] = useState<boolean>(false)

  const [micEnabled, setMicEnabled] = useState<boolean>(true)
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true)

  const [cameras, setCameras] = useState<DeviceInfo[]>([])
  const [mics, setMics] = useState<DeviceInfo[]>([])

  const [currentMic, setCurrentMicInternal] = useState<DeviceInfo>()
  const [currentCamera, setCurrentCameraInternal] = useState<DeviceInfo>()

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
    if (localAudioTrack) {
      return localAudioTrack
    }

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
    // If we don't have a room we should no-op instead of attempting to publish
    if (!room) { return }
    publishAudio()
    publishVideo()
  }

  const publishAudio = async () => {
    if (room) {
      dispatch(StartVideoChatAction())
      setPublishingMic(true)
      if (localAudioTrack) {
        room.localParticipant.publishTrack(localAudioTrack)
        await localAudioTrack.restart()
        startTranscription()
      }
    }
  }

  const publishVideo = () => {
    if (!room) {
      return
    }

    setPublishingCamera(true)

    if (localVideoTrack) {
      localVideoTrack.restart()
      localVideoTrack.enable(true)
      room.localParticipant.publishTrack(localVideoTrack)

      if (!localStreamView) {
        setLocalStreamView(<VideoTrack track={localVideoTrack} />)
      }
    }
  }

  const unpublishMedia = () => {
    console.log('In unpublish', localVideoTrack)

    dispatch(StopVideoChatAction())
    setPublishingCamera(false)
    setPublishingMic(false)

    if (localAudioTrack) {
      localAudioTrack.stop()
      stopSpeechRecognizer()

      if (room) {
        room.localParticipant.unpublishTrack(localAudioTrack)
      }
    }

    if (localVideoTrack) {
      // We shouldn't need to be so aggressive,
      // but track.stop() alone isn't doing it
      // and I can't be bothered to test which exact combo works
      localVideoTrack.stop()
      localVideoTrack.detach()
      localVideoTrack.disable()
      localVideoTrack.mediaStreamTrack.stop()

      if (room) {
        room.localParticipant.unpublishTrack(localVideoTrack)
      }
    }

    // setLocalStreamView(undefined)
  }

  useEffect(() => {
    if (!props.active) return
    console.log('[TWILIO] In useeffect for camera')
    if (!currentCamera) return
    console.log('[TWILIO] Has camera')
    fetchLocalVideoTrack()
  }, [currentCamera])

  useEffect(() => {
    if (!props.active) return
    if (!currentMic) return
    fetchLocalAudioTrack()
  }, [currentMic])

  useEffect(() => {
    if (!props.active) return
    if (micEnabled) {
      startTranscription()
    } else {
      stopTranscription()
    }
  }, [micEnabled])

  useEffect(() => {
    if (!props.active) return
    console.log('[TWILIO] In token roomId useEffect')
    // The initial token might get set after calling joinCall
    // This calls joinCall when we're ready after that initial setup
    if (token && roomId && !room) {
      console.log('[TWILIO] Joining room')
      joinCall(roomId, true)
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      stream.getTracks().forEach(t => t.stop())

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
          setCurrentCameraInternal(cameras[0])
          setCurrentMicInternal(mics[0])
        })
    } catch (e) {
      console.log('[TWILIO] Error fetching media devices', e)
      alert("We couldn't fetch your audio and video devices. This usually means another application is using your primary webcam or mic. Close anything that might be accessing them and try again. If that fails, confirm you haven't denied webcam/mic permission to this website in your browser.")
      dispatch(HideModalAction())
    }
  }

  async function joinCall (roomId: string, shouldPublishTracks: boolean) {
    if (!props.active) {
      console.warn('joinCall was called while text-only mode was on')
      return
    }
    // A useEffect hook will re-call this once the token exists
    if (!token) {
      setRoomId(roomId)
      return
    }

    // We're real sloppy re: calling this multiple times
    if (room && room.name === roomId) return

    if (room && room.name !== roomId) {
      // Remove from previous room
      room.disconnect()
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
        preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
        dominantSpeaker: true
      }

      if (shouldPublishTracks && localVideoTrack) {
        // This cast shouldn't be necessary, but I'm not sure how to fix it
        // (Because we define tracks as [] above, TS doesn't know if it's
        // LocalTrack[] or MediaStreamTrack[])
        (opts.tracks as Twilio.LocalTrack[]).push(localVideoTrack)
      }

      if (shouldPublishTracks && localAudioTrack) {
        (opts.tracks as Twilio.LocalTrack[]).push(localAudioTrack)
      }

      // This is to prevent a possible race condition where the user has the leave room setting on, switches rooms,
      // and then quickly rejoins. Because Twilio.connect can take seconds to resolve, this would lead to the user
      // joining the *previous* room before the Twilio.connect resolved and booted them with non-functioning tracks
      // into the new room.
      setRoom(undefined)
      // TODO: We should have error handling for various Twilio error codes, probably.
      // throw 'Uncomment this to simulate a Twilio failure.'
      const newRoom = await Twilio.connect(token, opts)
      setJoinCallFailed(false)

      // Note that dominantSpeaker can be set to null
      newRoom.on('dominantSpeakerChanged', (participant: Twilio.Participant) => {
        if (participant) {
          dispatch(MediaReceivedSpeakingDataAction(participant.identity))
        } else {
          dispatch(MediaReceivedSpeakingDataAction(null))
        }
      })

      // TODO: I worry this will send a single video/audio frame if disabled on start? To test
      newRoom.localParticipant.videoTracks.forEach(publication => {
        if (cameraEnabled) {
          publication.track.enable()
        } else {
          publication.track.disable()
        }
      })

      newRoom.localParticipant.audioTracks.forEach(publication => {
        if (micEnabled) {
          publication.track.enable()
        } else {
          publication.track.disable()
        }
      })

      console.log('[TWILIO] In room?', newRoom)
      console.log('[TWILIO] Attached participant count:', newRoom.participants.size)

      setLocalStreamView(<ParticipantTracks participant={newRoom.localParticipant} displayVideo={cameraEnabled} displayAudio={micEnabled} />)
      setRemoteParticipants(newRoom.participants)

      // Required so that when a user who is in the room begins publishing, it shows the user on the client, as the
      // client participant state can be out of sync with Twilio's state.
      newRoom.on('trackPublished', (publication: Twilio.RemoteTrackPublication, participant: Twilio.RemoteParticipant) => {
        dispatch(RefreshReactAction())
      })

      // I believe there's a race condition when another user leaves the video/audio channels between the draws due to
      // the event and the Twilio resolution, so sometimes the client re-renders before the person has finished
      // unpublishing. I'm not a huge fan of how many times we're pushing out the renders for the video chat, but to
      // properly sync everything up can wait, given that the conf is in...like, less than two weeks now.
      newRoom.on('trackUnpublished', (publication: Twilio.RemoteTrackPublication, participant: Twilio.RemoteParticipant) => {
        dispatch(RefreshReactAction())
      })

      newRoom.on('participantConnected', () => {
        setRemoteParticipants(newRoom.participants)
        // HACK ALERT: setRemoteParticipants(...) does not trigger a re-render of the MediaView, hence I force it here.
        // This function actually resolves *after* the room presence changes, so the client thinks nobody else is in
        // the MUD room and doesn't bring up the chat client. This then resolves, but the client still doesn't see the
        // user, so forcing a re-render surfaces that.
        dispatch(RefreshReactAction())
      })

      newRoom.on('participantDisconnected', () => {
        setRemoteParticipants(newRoom.participants)
        // HACK ALERT: setRemoteParticipants(...) does not trigger a re-render of the MediaView, hence I force it here.
        // This function actually resolves *after* the room presence changes, so the client thinks nobody else is in
        // the MUD room and doesn't bring up the chat client. This then resolves, but the client still doesn't see the
        // user, so forcing a re-render surfaces that.
        dispatch(RefreshReactAction())
      })

      window.addEventListener('beforeunload', (event) => {
        newRoom.disconnect()
      })

      setRoom(newRoom)
    } catch (e) {
      console.log('[TWILIO] Could not connect to room', e)
      setLocalStreamView(null)
      setJoinCallFailed(true)
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
        setCurrentCamera: async (id: string) => {
          console.log(`[TWILIO] Setting current camera from ${currentCamera.id} (${currentCamera.name}) to ${id}`)
          if (currentCamera && currentCamera.id !== id) {
            console.log('[TWILIO] Removing old camera', room)
            localVideoTrack.stop()
            if (room) {
              // TODO: room.unpublishTrack(localVideoTrack) wasn't working for some reason
              // This blunt approach works for now, but will need changing if we
              // e.g. add in screen sharing
              /*
              room.localParticipant.videoTracks.forEach(publication => {
                publication.unpublish()
              })
              */
              // TODO: There were huge issues with inconsistency with async timing issues leading to different media
              // being shown to others versus shown to you - that is, users thought they were using the wrong camera.
              // Booting the user out whenever they fiddle with their camera is brutal, but fixes it.
              dispatch(StopVideoChatAction())
              unpublishMedia()
            }
          }
          setCurrentCameraInternal(cameras.find((c) => c.id === id))
          localVideoTrack.restart()
          return null
        },
        setCurrentMic: (id: string) => {
          if (currentMic && currentMic.id !== id) {
            localAudioTrack.stop()
            if (room) {
              /* room.localParticipant.audioTracks.forEach(publication => {
                publication.unpublish()
              }) */
              dispatch(StopVideoChatAction())
              unpublishMedia()
            }
          }
          setCurrentMicInternal(mics.find(c => c.id === id))
          localAudioTrack.restart()
          return null
        },

        localStreamView,

        publishMedia,
        unpublishMedia,
        publishAudio,

        inCall: !!room,
        joinCallFailed: joinCallFailed,
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
