import { Message, WhisperMessage } from './message'

// Message cache

export async function getMessages (): Promise<{messages: Message[], whispers: WhisperMessage[]}|undefined> {
  let localLocalData = false
  const rawTimestamp = localStorage.getItem(messageTimestampKey)
  const rawMessageData = localStorage.getItem(messagesKey)
  const rawWhisperData = localStorage.getItem(whisperKey)
  if (rawTimestamp) {
    try {
      const timestamp = new Date(rawTimestamp)
      // A janky way to say "Is it older than an hour"
      localLocalData =
                  rawMessageData &&
                  new Date().getTime() - timestamp.getTime() < 1000 * 60 * 60
    } catch {
      console.log('Did not find a valid timestamp for message cache')
    }
  }

  if (localLocalData) {
    try {
      const messages = JSON.parse(rawMessageData)
      const whispers: WhisperMessage[] = JSON.parse(rawWhisperData) || []
      return { messages, whispers }
    } catch (e) {
      console.log('Could not parse message JSON', e)
    }
  }
}

export async function setMessages (messages: Message[], timestamp?: Date) {
  localStorage.setItem(messagesKey, JSON.stringify(messages))

  const timeString = (timestamp || new Date()).toUTCString()
  localStorage.setItem(messageTimestampKey, timeString)
}

export async function setWhispers (whispers: WhisperMessage[]) {
  localStorage.setItem(whisperKey, JSON.stringify(whispers))
}

// Rainbow gate

export async function getGateVisits (): Promise<number> {
  return parseInt(localStorage.getItem(rainbowGateKey)) || 0
}

export async function incrementGateVisits () {
  const visits = await getGateVisits() + 1
  localStorage.setItem(rainbowGateKey, visits.toString())
  return visits
}

// Username coloring

export async function getWasColoredEntering (): Promise<boolean> {
  return JSON.parse(localStorage.getItem(wasColoredEnteringKey)) || false
}

export async function setWasColoredEntering (value: boolean) {
  localStorage.setItem(wasColoredEnteringKey, JSON.stringify(value))
}

// User theme
export async function setTheme (theme: string) {
  localStorage.setItem(themeKey, theme)
}

export async function currentTheme (): Promise<string> {
  return localStorage.getItem(themeKey) || 'default'
}

// Show all movement messages

export async function getShouldShowAllMovementMessages (): Promise<boolean> {
  return JSON.parse(localStorage.getItem(showMovementMessagesKey)) || false
}

export async function setShouldShowAllMovementMessages (value: boolean) {
  localStorage.setItem(showMovementMessagesKey, JSON.stringify(value))
}

// Keys

const messagesKey = 'messages'
const messageTimestampKey = 'messageTimeStamp'
const whisperKey = 'whispers'
const rainbowGateKey = 'FeatureRainbowGateVisited'
const wasColoredEnteringKey = 'WasColoredEntering'
const themeKey = 'UserSelectedTheme'
const showMovementMessagesKey = 'ShowAllMovementMessages'
