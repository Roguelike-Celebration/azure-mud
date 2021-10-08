import { Dispatch } from 'react'
import {
  Action,
  MediaReceivedSpeakingDataAction
} from './Actions'

/* "Who's speaking" implementation notes
 * In another iteration of videochat, all audio streams got run through this audio analyzer code
 * Such that, when someone made a bunch of noise, their WebRTC PeerID got dispatched and set on an array of
 * IDs of "people who are speaking", which gets passed into MediaChatView.
 *
 * What currently exists:
 * - this analysis code is currently not referenced, but probably needs tweaking to handle Twilio IDs
 * - MediaChatView still gets a list of 'speaking' peers, but doesn't do anything with that data.
 *
 * I suspect we want to throw this out, and each individual speaker view should be responsible for detecting
 * whether it's speaking and updating the UI appropriately.
 * I also believe Twilio might give us some of this data automatically if we ask for it.
 *
 * I'm temporarily leaving all this code in place in case we want it.
 * But if you implement a different system and don't touch any of this, feel free to completely remove
 * this file, MediaReceivedSpeakingDataAction, state.speakingPeerIds, and everything that falls out from that.
*/

const peerAnalysers: [string, AnalyserNode][] = []

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
