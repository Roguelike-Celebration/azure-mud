import { Action, ActionType, UnlockBadgeAction } from './Actions'
import {
  Message,
  createConnectedMessage,
  createDisconnectedMessage,
  createEnteredMessage,
  createLeftMessage,
  createChatMessage,
  createWhisperMessage,
  createErrorMessage,
  createShoutMessage,
  createEmoteMessage,
  createDanceMessage,
  createModMessage,
  createMovedRoomMessage,
  createSameRoomMessage,
  isDeletable,
  createCommandMessage,
  WhisperMessage,
  createCaptionMessage
} from './message'
import { Room } from './room'
import {
  sendChatMessage,
  toggleUserBan,
  toggleUserMod,
  updateProfileColor,
  updateFontReward,
  fetchProfile,
  sendCaption
} from './networking'
import { PublicUser, MinimalUser, User } from '../server/src/user'
import { v4 as uuidv4 } from 'uuid'
import { Modal } from './modals'
import { matchingSlashCommand, SlashCommandType } from './SlashCommands'
import { MESSAGE_MAX_LENGTH, MESSAGE_MAX_WORD_LENGTH } from '../server/src/config'
import { ServerSettings, DEFAULT_SERVER_SETTINGS } from '../server/src/types'
import * as Storage from './storage'
import firebase from 'firebase/app'
import Config from './config'
import { Badge } from '../server/src/badges'
export interface State {
  firebaseApp: firebase.app.App;
  authenticated: boolean;
  checkedAuthentication: boolean;
  authenticationProvider?: string;
  mustVerifyEmail?: boolean;

  hasDismissedAModal: boolean;

  hasRegistered: boolean;

  roomId?: string;
  userId?: string;
  userMap: { [userId: string]: MinimalUser };
  roomData: { [roomId: string]: Room };
  profileData?: User;

  messages: Message[];
  whispers: WhisperMessage[];
  autoscrollChat: boolean;

  prepopulatedInput?: string;

  // Settings data
  useSimpleNames?: boolean;

  /** This is poorly named, but being "in media chat" means "is publishing audio and/or video" */
  inMediaChat: boolean;
  keepCameraWhenMoving?: boolean;
  captionsEnabled: boolean,

  /** text-only mode functionally overrides audio-only mode, since we don't even connect to Twilio */
  textOnlyMode?: boolean;
  audioOnlyMode?: boolean;

  /** Tuples of userId and when they were last the visible speaker */
  visibleSpeakers: [string, Date][]
  currentSpeaker?: string

  // How many people (other than you) to show in media chat
  numberOfFaces: number

  // If this is set to something other than Modal.None, that will indicate
  // which modal view should be rendered on top of the chat view
  activeModal: Modal
  activeModalOptions: ModalOptions,

  // User ID of whose profile should be shwon
  visibleProfile?: PublicUser;

  // If the device is a portrait smartphone, we hide the menu in favor of a hamburger button
  // In that situation, this reflects whether the side menu is visible.
  mobileSideMenuIsVisible?: boolean

  // If true, non-mods cannot access the space
  isClosed?: boolean

  isBanned: boolean

  serverSettings: ServerSettings

  unlockableBadges: Badge[]
  justUnlockedBadge?: Badge
}

console.log(Config.FIREBASE_CONFIG)
export const defaultState: State = {
  firebaseApp: firebase.initializeApp(Config.FIREBASE_CONFIG),
  authenticated: false,
  checkedAuthentication: false,
  hasRegistered: false,
  messages: [],
  whispers: [],
  visibleSpeakers: [],
  autoscrollChat: true,
  userMap: {},
  roomData: {},
  inMediaChat: false,
  activeModal: Modal.None,
  activeModalOptions: {},
  isBanned: false,
  serverSettings: DEFAULT_SERVER_SETTINGS,
  numberOfFaces: 5,
  captionsEnabled: false,
  hasDismissedAModal: false,
  unlockableBadges: []
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  console.log('In reducer', action)

  // TODO: This could hurt perf when we have a lot of messages
  const state: State = JSON.parse(JSON.stringify(oldState))
  state.prepopulatedInput = undefined

  if (action.type === ActionType.ReceivedMyProfile) {
    state.profileData = action.value
  }

  if (action.type === ActionType.ReceivedServerSettings) {
    state.serverSettings = action.value
  }

  if (action.type === ActionType.UpdatedCurrentRoom) {
    const oldRoomId = state.roomId
    state.roomId = action.value.roomId
    state.roomData = { ...state.roomData, ...action.value.roomData }

    if (state.roomId === 'entryway' || (state.roomData[state.roomId].mediaChat && !state.hasDismissedAModal)) {
      // 2020 behavior: Show every time someone loads into the entryway (the starting room)
      // 2021 behavior: In order to fix videochat connection issues, forcing this on every reload
      //  was a hacky way to make sure that players always interacted with the page before we loaded videochat
      // 2022 behavior (for now): Just limit that to rooms with videochat, since we're making less of those.
      state.activeModal = Modal.Welcome
    }

    // Add a local "you have moved to X room" message
    // Don't display if we're in the same room (issue 162)
    if (state.roomData && state.roomData[action.value.roomId]) {
      const room = state.roomData[action.value.roomId]
      if (state.roomId !== oldRoomId) {
        addMessage(state, createMovedRoomMessage(room.shortName))
      } else {
        addMessage(state, createSameRoomMessage(room.shortName))
      }
    }

    /** Here lies a giant hack.
     * So, the WebRTC connection handshake lives outside of Flux.
     * The set of peer connections are long-lived objects that shouldn't live inside React components,
     * but they also need access to a `dispatch` function, so having them separate seems easiest.
     *
     * HOWEVER!
     * When a new peer says "hey, you can connect to me", we need some state data.
     * Specifically, we need to know if you're currently in a videocall.
     * This means we need to do some state-munging to actively remove you from a call once you've left the room.
     *
     * TODO: There may be cases other than moving rooms where we want to disconnect you.
     * If so, we need to dupe this logic there.
     */
    // (action as Action).type = ActionType.StopVideoChat
  }

  if (action.type === ActionType.UpdatedRoomData) {
    state.roomData = { ...state.roomData, ...action.value }
  }

  if (action.type === ActionType.UpdatedPresence) {
    Object.keys(action.value).forEach((roomId) => {
      if (state.roomData[roomId]) {
        state.roomData[roomId].users = action.value[roomId]
      }
    })
  }

  if (action.type === ActionType.PlayerConnected) {
    const user = action.value
    const roomData = state.roomData[state.roomId]
    if (!roomData.users.includes(user.id)) {
      roomData.users.push(user.id)
      addMessage(state, createConnectedMessage(user.id, state.roomId, roomData.users.length))
    }
    state.userMap[user.id] = user
  }

  if (action.type === ActionType.PlayerDisconnected) {
    const roomData = state.roomData[state.roomId]
    roomData.users = roomData.users.filter((u) => u !== action.value)
    addMessage(state, createDisconnectedMessage(action.value, state.roomId, roomData.users.length))
  }

  if (action.type === ActionType.PlayerEntered) {
    const roomData = state.roomData[state.roomId]
    if (!roomData.users.includes(action.value.name)) {
      roomData.users.push(action.value.name)
      addMessage(state,
        createEnteredMessage(action.value.name, action.value.fromId, action.value.fromName, state.roomId, roomData.users.length)
      )
    }
  }

  if (action.type === ActionType.PlayerLeft) {
    const roomData = state.roomData[state.roomId]
    roomData.users = roomData.users.filter((u) => u !== action.value.name)
    addMessage(state, createLeftMessage(action.value.name, action.value.toId, action.value.toName, state.roomId, roomData.users.length))
  }

  if (action.type === ActionType.ChatMessage) {
    addMessage(state,
      createChatMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.CaptionMessage) {
    addMessage(state,
      createCaptionMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.Whisper) {
    const whisperMessage = createWhisperMessage(action.value.name, action.value.message)
    addMessage(state, whisperMessage)
    saveWhisper(state, whisperMessage)
  }

  if (action.type === ActionType.ModMessage) {
    addMessage(
      state,
      createModMessage(
        action.value.name,
        action.value.message,
        action.value.name === state.userId
      )
    )
  }

  if (action.type === ActionType.DeleteMessage) {
    deleteMessage(state, action.value.targetMessageId)
  }

  if (action.type === ActionType.Shout) {
    addMessage(state,
      createShoutMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.Emote) {
    addMessage(state,
      createEmoteMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.Dance) {
    addMessage(state,
      createDanceMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.UserMap) {
    state.userMap = { ...state.userMap, ...action.value }

    // If the actively-viewed profile updated, do a clean fetch
    if (state.visibleProfile && state.userMap[state.visibleProfile.id]) {
      fetchProfile(state.visibleProfile.id)
    }
  }

  if (action.type === ActionType.PlayerBanned) {
    if (action.value.id === state.userId) {
      state.isBanned = true
    } else {
      state.userMap[action.value.id].isBanned = true
      addMessage(state, createErrorMessage('User ' + action.value.username + ' was banned!'))
    }
  }

  // This message is never received by the banned player.
  if (action.type === ActionType.PlayerUnbanned) {
    if (state.userMap[action.value.id]) {
      state.userMap[action.value.id].isBanned = false
    }
    addMessage(state, createErrorMessage('User ' + action.value.username + ' was unbanned!'))
  }

  if (action.type === ActionType.UpdateProfileColor) {
    state.userMap[state.userId].nameColor = action.color

    if (action.color) {
      addMessage(state, createErrorMessage('Your name color was changed to ' + action.color))
    } else {
      addMessage(state, createErrorMessage('Your name color has changed back to its original state.'))
    }

    updateProfileColor(state.userId, action.color)
  }

  if (action.type === ActionType.UpdateFontReward) {
    state.userMap[state.userId].fontReward = action.font

    // I'm following the pattern of the set colour but... I don't think the user sees these message, and they aren't errors, why do we do this?
    if (action.font) {
      addMessage(state, createErrorMessage('You feel invigorated, and like you\'ve become more... ' + action.font))
    } else {
      addMessage(state, createErrorMessage('You feel yourself return to your normal state, like you never went riddling to begin with.'))
    }

    updateFontReward(state.userId, action.font)
  }

  if (action.type === ActionType.Error) {
    addMessage(state, createErrorMessage(action.value))
  }

  if (action.type === ActionType.MediaReceivedSpeakingData) {
    state.currentSpeaker = action.value
    if (action.value !== null && action.value !== state.userId) {
      if (!state.visibleSpeakers.find(([userId, _]) => userId === action.value)) {
        if (state.visibleSpeakers.length < state.numberOfFaces) {
          state.visibleSpeakers.push([action.value, new Date()])
        } else {
          // Find the oldest speaker and replace them
          let oldestIndex = -1
          let oldestTime = new Date()
          for (let i = 0; i < state.visibleSpeakers.length; i++) {
            if (state.visibleSpeakers[i][1] < oldestTime) {
              oldestTime = state.visibleSpeakers[i][1]
              oldestIndex = i
            }
          }
          state.visibleSpeakers[oldestIndex] = [action.value, new Date()]
        }
      }
    }
  }

  if (action.type === ActionType.SetNumberOfFaces) {
    state.numberOfFaces = action.value
  }

  if (action.type === ActionType.StartVideoChat) {
    state.inMediaChat = true
  }

  if (action.type === ActionType.StopVideoChat) {
    // stopAudioAnalyserLoop()
    state.inMediaChat = false
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    const messageId: string = uuidv4()
    const trimmedMessage = action.value.trim()
    const beginsWithSlash = /^\/.+?/.exec(trimmedMessage)
    const matching = beginsWithSlash ? matchingSlashCommand(trimmedMessage) : undefined

    if (trimmedMessage.length > MESSAGE_MAX_LENGTH) {
      addMessage(state, createErrorMessage('Your message is too long! Please try to keep it under ~600 characters!'))
    } else if (trimmedMessage.split(' ').find((s) => s.length > MESSAGE_MAX_WORD_LENGTH)) {
      addMessage(state, createErrorMessage('Your message has a word that is too long! Please keep it under 60 characters!'))
    } else if (beginsWithSlash && matching === undefined) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      addMessage(state, createErrorMessage(`Your command ${commandStr ? commandStr[1] : action.value} is not a registered slash command!`))
    } else if (beginsWithSlash && matching.type === SlashCommandType.Whisper) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      const parsedUsernameMessage = /^(.+?) (.+)/.exec(commandStr[2])

      if (!parsedUsernameMessage) {
        addMessage(state, createErrorMessage(`Your whisper to ${commandStr[2]} had no message!`))
      } else {
        sendChatMessage(messageId, trimmedMessage)

        const [_, username, message] = parsedUsernameMessage
        const user = Object.values(state.userMap).find(
          (u) => u.username === username
        )
        const userId = user && user.id
        if (userId) {
          const whisperMessage = createWhisperMessage(userId, message, true)
          addMessage(state, whisperMessage)
          saveWhisper(state, whisperMessage)
        }
      }
    } else if (beginsWithSlash && matching.type === SlashCommandType.Help) {
      state.activeModal = Modal.Help
      addMessage(state, createCommandMessage('You consult the help docs. (You can also find them in sidebar!)'))
    } else if (beginsWithSlash && matching.type === SlashCommandType.Look) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      addMessage(state, createCommandMessage(`You attempt to examine ${commandStr[2]}. (You can also click on their username and select Profile!)`))
      sendChatMessage(messageId, trimmedMessage)
    } else if (beginsWithSlash) {
      sendChatMessage(messageId, trimmedMessage)
    } else {
      sendChatMessage(messageId, action.value)
      addMessage(state, createChatMessage(messageId, state.userId, action.value))
    }
  }

  if (action.type === ActionType.SendCaption) {
    const messageId: string = uuidv4()
    sendCaption(messageId, action.value)
    addMessage(state, createCaptionMessage(messageId, state.userId, action.value))
  }

  if (action.type === ActionType.StartWhisper) {
    state.prepopulatedInput = `/whisper ${action.value} `
  }

  if (action.type === ActionType.HideModalAction) {
    state.activeModal = Modal.None
    state.hasDismissedAModal = true
  }

  if (action.type === ActionType.ShowProfile) {
    state.visibleProfile = action.value
  }

  if (action.type === ActionType.HideProfile) {
    state.visibleProfile = null
  }

  if (action.type === ActionType.ShowModal) {
    state.activeModal = action.value
    state.activeModalOptions = {}
  }

  if (action.type === ActionType.ShowModalWithOptions) {
    console.log('Showing', action)
    state.activeModal = action.value.modal
    state.activeModalOptions = action.value.options
  }

  if (action.type === ActionType.ShowSideMenu) {
    state.mobileSideMenuIsVisible = true
  }

  if (action.type === ActionType.HideSideMenu) {
    state.mobileSideMenuIsVisible = false
  }

  if (action.type === ActionType.DeactivateAutoscroll) {
    state.autoscrollChat = false
  }

  if (action.type === ActionType.ActivateAutoscroll) {
    state.autoscrollChat = true
  }

  if (action.type === ActionType.SetUseSimpleNames) {
    state.useSimpleNames = action.value
    Storage.setUseSimpleNames(action.value)
  }

  if (action.type === ActionType.SetKeepCameraWhenMoving) {
    state.keepCameraWhenMoving = action.value
    Storage.setKeepCameraWhenMoving(action.value)
  }

  if (action.type === ActionType.SetCaptionsEnabled) {
    state.captionsEnabled = action.value
    Storage.setCaptionsEnabled(action.value)
  }

  if (action.type === ActionType.SetTextOnlyMode) {
    state.textOnlyMode = action.textOnlyMode
    if (!action.refresh) {
      Storage.setTextOnlyMode(action.textOnlyMode)
    } else {
      Storage.setTextOnlyMode(action.textOnlyMode).then(() => window.location.reload())
    }
  }

  if (action.type === ActionType.SetAudioOnlyMode) {
    state.audioOnlyMode = action.value
  }

  if (action.type === ActionType.Authenticate) {
    state.checkedAuthentication = true

    state.authenticationProvider = action.value.provider
    state.mustVerifyEmail = action.value.mustVerifyEmail

    if (action.value.userId && action.value.name) {
      state.authenticated = true
      state.userId = action.value.userId

      // If you haven't registered yet, we need to grab your username before we've pulled a server userMap
      state.userMap[action.value.userId] = {
        id: action.value.userId,
        username: action.value.name
      }
    } else {
      state.authenticated = undefined
      state.userId = undefined
    }
  }

  if (action.type === ActionType.IsRegistered) {
    state.hasRegistered = true
  }

  if (action.type === ActionType.BanToggle) {
    toggleUserBan(action.value)
  }

  if (action.type === ActionType.ModToggle) {
    toggleUserMod(action.value)
  }

  if (action.type === ActionType.LoadMessageArchive) {
    state.messages = action.messages
    state.whispers = action.whispers || []
  }

  // Notes
  if (action.type === ActionType.NoteAdd) {
    const room = state.roomData && state.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      if (!room.notes) room.notes = []

      room.notes.push(action.value.note)
    }
  }

  if (action.type === ActionType.NoteRemove) {
    const room = state.roomData && state.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      if (!room.notes) room.notes = []

      room.notes = room.notes.filter(n => n.id !== action.value.noteId)
    }
  }

  if (action.type === ActionType.NoteUpdateLikes) {
    const room = state.roomData && state.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      if (!room.notes) room.notes = []

      const note = room.notes.find(n => n.id === action.value.noteId)
      if (note) {
        note.likes = action.value.likes
      }
    }
  }

  if (action.type === ActionType.NoteUpdateRoom) {
    const room = state.roomData && state.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      room.notes = action.value.notes
    }
  }

  if (action.type === ActionType.SpaceIsClosed) {
    state.isClosed = true
  }

  if (action.type === ActionType.SpaceOpenedOrClosed) {
    if (state.userMap[state.userId].isMod) {
      state.isClosed = action.value
      addMessage(state, createCommandMessage(`The space is now ${action.value ? 'closed' : 'open'}`))
    } else {
      // Not reloading the page will show the 'go home' screen, but will still send SignalR data
      // Just hard-reloading the page will stop them from getting messages
      window.location.reload()
    }
  }

  if (action.type === ActionType.CommandMessage) {
    const message = createCommandMessage(action.value)
    addMessage(state, message)
  }

  if (action.type === ActionType.EquipBadge) {
    if (!state.profileData.equippedBadges) {
      state.profileData.equippedBadges = []
    }
    state.profileData.equippedBadges[action.value.index] = action.value.badge
  }

  if (action.type === ActionType.UnlockBadge) {
    state.profileData.unlockedBadges.push(action.value)
    state.justUnlockedBadge = action.value
    state.activeModal = Modal.BadgeUnlock
  }

  if (action.type === ActionType.SetUnlockedBadges) {
    state.profileData.unlockedBadges = action.value
  }

  if (action.type === ActionType.UpdateUnlockableBadges) {
    state.unlockableBadges = action.value
  }

  return state
}

// WARNING: These three functions modify the message state without awaiting on the result.
// If you're seeing weird race conditions with the message store, that's probably the issue.

function deleteMessage (state: State, messageId: String) {
  const target = state.messages.find(m => isDeletable(m) && m.messageId === messageId)
  // Calling isDeletable again here so TypeScript can properly cast; if there's a nicer way to do this, please inform!
  if (isDeletable(target)) {
    target.message = 'message was removed by moderator'
    Storage.setMessages(state.messages)
  }
}

async function saveWhisper (state: State, message: WhisperMessage) {
  state.whispers.push(message)
  Storage.setWhispers(state.whispers)
}

async function addMessage (state: State, message: Message) {
  state.messages.push(message)
  // state.messages = state.messages.slice(-500)
  Storage.setMessages(state.messages)
}

// This is intended to be a big old unreadable grab bag,
// but seems better than alternatives
export interface ModalOptions {
    hideVideo?: boolean,
    showJoinButton?: boolean
}
