import localforage from 'localforage'

import { Message, WhisperMessage } from './message/index.js'

// Message cache

export interface MessageArchiveData {
  messages: Message[]
  whispers: WhisperMessage[]
}

const ONE_HOUR_IN_MS = 1000 * 60 * 60

export async function getMessages (): Promise<MessageArchiveData | undefined> {
  try {
    const timestamp: Date = await localforage.getItem(messageTimestampKey)
    const messages: Message[] = await localforage.getItem(messagesKey)
    const whispers: WhisperMessage[] = await localforage.getItem(whisperKey)

    if (timestamp && ((new Date().getTime() - timestamp.getTime()) < ONE_HOUR_IN_MS)) {
      console.log(`Retrieved fresh message archive from browser storage (timestamp ${timestamp})`,
        messages, whispers)
      return { messages, whispers }
    }

    // If we haven't returned yet, there's either no valid timestamp, or too old a timestamp
  } catch (err) {
    console.error('Storage error in getMessages retrieving message archive', err)
  }
  return undefined
}

export async function setMessages (messages: Message[], timestamp?: Date): Promise<void> {
  await localforage.setItem(messagesKey, messages)
  await localforage.setItem(messageTimestampKey, timestamp || new Date())
}

export async function setWhispers (whispers: WhisperMessage[]): Promise<void> {
  await localforage.setItem(whisperKey, whispers)
}

// Rainbow gate

export async function getGateVisits (): Promise<number> {
  return await localforage.getItem(rainbowGateKey) || 0
}

export async function incrementGateVisits (): Promise<number> {
  const visits = await getGateVisits() + 1
  await localforage.setItem(rainbowGateKey, visits)
  return visits
}

// Username coloring

export async function getWasColoredEntering (): Promise<boolean> {
  return await localforage.getItem(wasColoredEnteringKey) || false
}

export async function setWasColoredEntering (value: boolean): Promise<void> {
  await localforage.setItem(wasColoredEnteringKey, value)
}

// Settings page
export async function setTheme (theme: string): Promise<void> {
  await localforage.setItem(themeKey, theme)
}

export async function currentTheme (): Promise<string> {
  return await localforage.getItem(themeKey) || 'default'
}

export async function setUseSimpleNames (useSimpleNames: boolean): Promise<void> {
  await localforage.setItem(useSimpleNamesKey, useSimpleNames)
}

export async function getUseSimpleNames (): Promise<boolean> {
  return await localforage.getItem(useSimpleNamesKey) || false
}

// Keys

const messagesKey = 'messages'
const messageTimestampKey = 'messageTimeStamp'
const whisperKey = 'whispers'
const rainbowGateKey = 'FeatureRainbowGateVisited'
const wasColoredEnteringKey = 'WasColoredEntering'
const themeKey = 'UserSelectedTheme'
const useSimpleNamesKey = 'UseSimpleNames'
