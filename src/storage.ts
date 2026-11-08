import localforage from 'localforage'

import { Message, WhisperMessage } from './message/index.js'

// Message cache

export interface MessageArchiveData {
  messages: Message[]
  whispers: WhisperMessage[]
}

const ONE_HOUR_IN_MS = 1000 * 60 * 60

/** Cache key for per-MUD-user cached items. */
function userKey (key: string, userId: string) {
  return `uid_${userId}/${key}`
}

export async function getMessages (userId: string): Promise<MessageArchiveData | undefined> {
  try {
    // TODO: Enable this cache cleanup once the user-keyed cache has been deployed a while. It
    // went out in 2026-11, so this can be enabled in 2026-12 or 2027-01.
    // await removeOldUnkeyedMessageCache()
    const timestamp: Date | null = await localforage.getItem(userKey(messageTimestampKey, userId))
    const messages: Message[] = (await localforage.getItem(userKey(messagesKey, userId))) ?? []
    const whispers: WhisperMessage[] = (await localforage.getItem(userKey(whisperKey, userId))) || []

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

export async function setMessages (userId: string, messages: Message[], timestamp?: Date): Promise<void> {
  await localforage.setItem(userKey(messagesKey, userId), messages)
  await localforage.setItem(userKey(messageTimestampKey, userId), timestamp || new Date())
}

export async function setWhispers (userId: string, whispers: WhisperMessage[]): Promise<void> {
  await localforage.setItem(userKey(whisperKey, userId), whispers)
}

/** Cleans up leftover non-user-keyed message cache, from before they became per-user in 2026-11. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- call in getMessages() is commented out for now
async function removeOldUnkeyedMessageCache (): Promise<void> {
  const oldKeys = [messagesKey, messageTimestampKey, whisperKey]
  const foundKeys = (await localforage.keys()).filter((key) => oldKeys.includes(key))
  if (foundKeys.length === 0) {
    return
  }
  await Promise.all(foundKeys.map((key) => localforage.removeItem(key)))
  console.log('Removed old non-per-user message cache entries: %s', foundKeys.join(', '))
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

export async function setShowDebugControls (showDebugControls: boolean): Promise<void> {
  await localforage.setItem(showDebugControlsKey, showDebugControls)
}

export async function getShowDebugControls (): Promise<boolean> {
  return await localforage.getItem(showDebugControlsKey) || false
}

// Keys

const messagesKey = 'messages'
const messageTimestampKey = 'messageTimeStamp'
const whisperKey = 'whispers'
const rainbowGateKey = 'FeatureRainbowGateVisited'
const wasColoredEnteringKey = 'WasColoredEntering'
const themeKey = 'UserSelectedTheme'
const useSimpleNamesKey = 'UseSimpleNames'
const showDebugControlsKey = 'ShowDebugControls'
