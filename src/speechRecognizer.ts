import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

import {
  ResultReason,
  CancellationReason
} from 'microsoft-cognitiveservices-speech-sdk'
import { Dispatch } from 'react'
import { Action, SendCaptionAction } from './Actions'
import { fetchCognitiveServicesKey } from './networking'

let recognizer: sdk.SpeechRecognizer | undefined
let speechConfig: sdk.SpeechConfig | undefined

export async function setUpSpeechRecognizer (
  deviceId: string,
  dispatch: Dispatch<Action>
): Promise<void> {
  console.log('Starting recognition')
  if (recognizer) {
    await recognizer.stopContinuousRecognitionAsync()
  }

  if (!speechConfig) {
    const { cognitiveServicesKey, cognitiveServicesRegion } = await fetchCognitiveServicesKey()
    speechConfig = sdk.SpeechConfig.fromSubscription(
      cognitiveServicesKey,
      cognitiveServicesRegion
    )
  }

  const audioConfig = sdk.AudioConfig.fromMicrophoneInput(deviceId)
  recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

  recognizer.recognizing = (s, e) => {
    console.log('RECOGNIZING: ', e.result.text)
  }
  recognizer.recognized = (s, e) => {
    if (e.result.reason === ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`)
      if (e.result.text !== '') {
        dispatch(SendCaptionAction(e.result.text))
      }
    } else if (e.result.reason === ResultReason.NoMatch) {
      console.log('NOMATCH: Speech could not be recognized.')
    }
  }

  recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`)

    if (e.reason === CancellationReason.Error) {
      console.log(`"CANCELED: ErrorCode=${e.errorCode}`)
      console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`)
      console.log('CANCELED: Did you update the subscription info?')
    }

    recognizer.stopContinuousRecognitionAsync()
  }

  recognizer.sessionStopped = (s, e) => {
    console.log('\n    Session stopped event.')
    recognizer.stopContinuousRecognitionAsync()
  }

  recognizer.startContinuousRecognitionAsync()
}

export async function stopSpeechRecognizer () {
  await recognizer.stopContinuousRecognitionAsync()
}
