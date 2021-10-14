import { Message, WhisperMessage } from './message'
import localforage from 'localforage'

// Message cache

export async function getMessages (): Promise<{messages: Message[], whispers: WhisperMessage[]}|undefined> {
  try {
    const timestamp: Date = await localforage.getItem(messageTimestampKey)
    const messages: Message[] = await localforage.getItem(messagesKey)
    const whispers: WhisperMessage[] = await localforage.getItem(whisperKey)

    // A janky way to say "Is it older than an hour"
    if (timestamp && new Date().getTime() - timestamp.getTime() < 1000 * 60 * 60) {
      console.log(messages, whispers)
      return { messages, whispers }
    }

    // If we haven't returned yet, there's either no valid timestamp, or too old a timestamp
  } catch (err) {
    console.log('Storage error', err)
  }
}

export async function setMessages (messages: Message[], timestamp?: Date) {
  await localforage.setItem(messagesKey, messages)
  await localforage.setItem(messageTimestampKey, timestamp || new Date())
}

export async function setWhispers (whispers: WhisperMessage[]) {
  await localforage.setItem(whisperKey, whispers)
}

// Rainbow gate

export async function getGateVisits (): Promise<number> {
  return await localforage.getItem(rainbowGateKey) || 0
}

export async function incrementGateVisits () {
  const visits = await getGateVisits() + 1
  await localforage.setItem(rainbowGateKey, visits)
  return visits
}

// Username coloring

export async function getWasColoredEntering (): Promise<boolean> {
  return await localforage.getItem(wasColoredEnteringKey) || false
}

export async function setWasColoredEntering (value: boolean) {
  await localforage.setItem(wasColoredEnteringKey, value)
}

// Settings page
export async function setTheme (theme: string) {
  await localforage.setItem(themeKey, theme)
}

export async function currentTheme (): Promise<string> {
  return await localforage.getItem(themeKey) || 'default'
}

export async function setUseSimpleNames (useSimpleNames: boolean) {
  await localforage.setItem(useSimpleNamesKey, useSimpleNames)
}

export async function getUseSimpleNames (): Promise<boolean> {
  return await localforage.getItem(useSimpleNamesKey) || false
}

// Video chat settings
export async function setKeepCameraWhenMoving (keepCameraWhenMoving: boolean) {
  await localforage.setItem(keepCameraWhenMovingKey, keepCameraWhenMoving)
}

export async function getKeepCameraWhenMoving (): Promise<boolean> {
  const keepCameraWhenMoving: boolean = await localforage.getItem(keepCameraWhenMovingKey)
  return keepCameraWhenMoving === null ? false : keepCameraWhenMoving
}

export async function setTextOnlyMode (textOnlyMode: boolean) {
  await localforage.setItem(textOnlyModeKey, textOnlyMode)
}

export async function getTextOnlyMode (): Promise<boolean> {
  const textOnlyMode: boolean = await localforage.getItem(textOnlyModeKey)
  return textOnlyMode == null ? false : textOnlyMode
}

export async function setCaptionsEnabled (enabled: boolean) {
  await localforage.setItem(captionsEnabledKey, enabled)
}

export async function getCaptionsEnabled (): Promise<boolean> {
  const captionsEnabled: boolean = await localforage.getItem(captionsEnabledKey)
  return captionsEnabled == null ? false : captionsEnabled
}

// Keys

const messagesKey = 'messages'
const messageTimestampKey = 'messageTimeStamp'
const whisperKey = 'whispers'
const rainbowGateKey = 'FeatureRainbowGateVisited'
const wasColoredEnteringKey = 'WasColoredEntering'
const themeKey = 'UserSelectedTheme'
const useSimpleNamesKey = 'UseSimpleNames'
const keepCameraWhenMovingKey = 'KeepCameraWhenMoving'
const textOnlyModeKey = 'TextOnlyMode'
const captionsEnabledKey = 'CaptionsEnabled'
