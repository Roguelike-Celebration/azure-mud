import SimplePeer from 'simple-peer'
import { sendSignalData } from './networking'
import { Dispatch } from 'react'
import {
  Action,
  LocalMediaStreamOpenedAction,
  P2PDataReceivedAction,
  P2PStreamReceivedAction,
  P2PConnectionClosedAction,
  MediaReceivedSpeakingDataAction
} from './Actions'

let mediaStream: MediaStream

export function localMediaStream (): MediaStream | undefined {
  return mediaStream
}

export function otherMediaStreams (): { [id: string]: MediaStream } {
  return peerStreams
}

export const getMediaStream = async (
  dispatch?: Dispatch<Action>,
  deviceIds?: { audioId?: string; videoId?: string }
): Promise<MediaStream | undefined> => {
  console.log('Trying to open media stream')

  // If audioId or videoId aren't passed in, we just want an existing stream
  // So return one if we have it
  if (mediaStream && !deviceIds) {
    return mediaStream
  }

  const oldStream: MediaStream = mediaStream
  let stream: MediaStream = null

  const constraints: MediaStreamConstraints = {
    audio: true,
    video: { facingMode: 'user' }
  }

  if (deviceIds && deviceIds.audioId) {
    constraints.audio = { deviceId: deviceIds.audioId }
  }

  if (deviceIds && deviceIds.videoId) {
    constraints.video = { deviceId: deviceIds.videoId }
  }

  console.log(constraints)
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err) {
    console.log('Video error', err)
    alert('Could not load your webcam. Investigate your browser settings and try again')
    return
  }

  console.log('We have a new stream?')

  mediaStream = stream

  if (dispatch) {
    let videoDeviceId, audioDeviceId

    // HACK: getCapabilities() isn't supported in Firefox
    // So we need to check if it exists before calling.
    // If it doesn't exist, MediaSelectorView finds the deviceId with a label lookup.

    const videoStream = stream.getVideoTracks()[0]
    if (videoStream) {
      if (videoStream.getCapabilities) {
        videoDeviceId = videoStream.getCapabilities().deviceId
      } else {
        videoDeviceId = videoStream.label
      }
    }

    const audioStream = stream.getAudioTracks()[0]
    if (audioStream) {
      if (audioStream.getCapabilities) {
        audioDeviceId = audioStream.getCapabilities().deviceId
      } else {
        audioDeviceId = audioStream.label
      }
    }

    dispatch(
      LocalMediaStreamOpenedAction(stream.id, { videoDeviceId, audioDeviceId })
    )

    Object.values(peers).forEach((p) => {
      if (oldStream) {
        p.removeStream(oldStream)
      }
      p.addStream(stream)
    })

    peerAnalysers = peerAnalysers.filter((a) => a[0] !== 'self')
    peerAnalysers.push(['self', setUpAnalyser(stream)])
    startAnalyserLoop(dispatch)
  }

  return stream
}

export async function toggleVideo (newState: boolean) {
  const stream = await getMediaStream()
  const track = stream.getVideoTracks()[0]
  if (!track) {
    console.log('Error: No video track!')
    return
  }

  track.enabled = !newState
}

export async function toggleAudio (newState: boolean) {
  const stream = await getMediaStream()
  const track = stream.getAudioTracks()[0]
  if (!track) {
    console.log('Error: No audio track!')
    return
  }

  track.enabled = !newState
}

export async function startSignaling (
  peerId: string,
  dispatch: Dispatch<Action>
) {
  const stream = await getMediaStream(dispatch)
  const peer = new SimplePeer({ initiator: true, stream })
  peers[peerId] = peer
  setUpPeer(peerId, peer, dispatch)
}

export async function receiveSignalData (
  peerId: string,
  data: string,
  dispatch: Dispatch<Action>
) {
  const stream = await getMediaStream(dispatch)
  let peer = peers[peerId]
  if (!peer) {
    peer = new SimplePeer({ stream })
    peers[peerId] = peer
    setUpPeer(peerId, peer, dispatch)
  }

  peer.signal(data)
}

const peers: { [id: string]: SimplePeer.Instance } = {}
const peerStreams: { [id: string]: MediaStream } = {}
let peerAnalysers: [string, AnalyserNode][] = []

export function sendToPeer (id: string, msg: string) {
  peers[id].send(msg)
}

export function broadcastToPeers (msg: string) {
  Object.values(peers).forEach((c) => {
    if (!c.writable) return
    c.send(msg)
  })
}

export function disconnectAllPeers () {
  Object.values(peers).forEach((p) => {
    p.destroy()
  })
}

function setUpPeer (
  peerId: string,
  peer: SimplePeer.Instance,
  dispatch: Dispatch<Action>
) {
  peer.on('signal', (data) => {
    console.log('SIGNAL', JSON.stringify(data))

    sendSignalData(peerId, data)
  })

  peer.on('connect', () => {
    console.log(`Peer ${peerId} connected!`)
  })

  peer.on('close', () => {
    console.log('WebRTC peer closed', peerId)
    delete peers[peerId]
    delete peerStreams[peerId]
    dispatch(P2PConnectionClosedAction(peerId))
  })

  peer.on('err', (e) => {
    console.log('Peer errored out', peerId, e)
    delete peers[peerId]
    delete peerStreams[peerId]
    dispatch(P2PConnectionClosedAction(peerId))
  })

  peer.on('data', (data) => {
    console.log('Received data from peer', data)
    dispatch(P2PDataReceivedAction(peerId, data))
  })

  peer.on('stream', (stream) => {
    console.log('Received stream', peerId)
    peerStreams[peerId] = stream
    dispatch(P2PStreamReceivedAction(peerId))

    const analyser = setUpAnalyser(stream)
    peerAnalysers.push([peerId, analyser])
  })
}

function setUpAnalyser (stream: MediaStream): AnalyserNode {
  const audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)()
  const source = audioCtx.createMediaStreamSource(stream)
  var analyser = audioCtx.createAnalyser()
  analyser.minDecibels = -90
  analyser.maxDecibels = -10
  analyser.smoothingTimeConstant = 0.85

  source.connect(analyser)

  return analyser
}

let shouldStopAnalysing = false
function startAnalyserLoop (dispatch: Dispatch<Action>) {
  console.log('Starting analyser loop')

  const average = (ns: Uint8Array) => {
    let sum = 0
    for (let i = 0; i < ns.length; i++) {
      sum += ns[i]
    }
    return (sum /= ns.length)
  }

  const analyse = () => {
    const list: string[] = []

    if (shouldStopAnalysing) {
      shouldStopAnalysing = false
      return
    }

    peerAnalysers.forEach(([id, a]) => {
      a.fftSize = 2048
      const bufferLength = a.fftSize
      const byteFrequencyDataArray = new Uint8Array(bufferLength)

      a.getByteFrequencyData(byteFrequencyDataArray)

      if (average(byteFrequencyDataArray) > 1) {
        list.push(id)
      }
    })

    dispatch(MediaReceivedSpeakingDataAction(list))

    window.requestAnimationFrame(analyse)
  }
  window.requestAnimationFrame(analyse)
}

export function stopAudioAnalyserLoop () {
  shouldStopAnalysing = true
}

export function stopAllDeviceUsage () {
  if (localMediaStream()) {
    localMediaStream().getTracks().forEach(e => e.stop())
  }
}
