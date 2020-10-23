import { Message, WhisperMessage } from './message'

// Message cache

export function getMessages (): {messages: Message[], whispers: WhisperMessage[]}|undefined {
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

export function setMessages (messages: Message[], timestamp?: Date) {
  localStorage.setItem(messagesKey, JSON.stringify(messages))

  const timeString = (timestamp || new Date()).toUTCString()
  localStorage.setItem(messageTimestampKey, timeString)
}

export function setWhispers (whispers: WhisperMessage[]) {
  localStorage.setItem(whisperKey, JSON.stringify(whispers))
}

// Rainbow gate

export function getGateVisits (): number {
  return parseInt(localStorage.getItem(rainbowGateKey)) || 0
}

export function incrementGateVisits () {
  const visits = getGateVisits() + 1
  localStorage.setItem(rainbowGateKey, visits.toString())
  return visits
}

// Username coloring

export function getWasColoredEntering (): boolean {
  return localStorage.get(wasColoredEnteringKey)
}

export function setWasColoredEntering (value: boolean) {
  localStorage.setItem(wasColoredEnteringKey, JSON.stringify(value))
}

// User theme
export function setTheme (theme: string) {
  localStorage.setItem(themeKey, theme)
}

export function currentTheme (): string {
  return localStorage.getItem(themeKey) || 'default'
}

// Show all movement messages

export function getShouldShowAllMovementMessages (): boolean {
  return JSON.parse(localStorage.getItem(showMovementMessagesKey)) || false
}

export function setShouldShowAllMovementMessages (value: boolean) {
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
