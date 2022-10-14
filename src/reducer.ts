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
  isDeletableMessage,
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
import { MESSAGE_MAX_LENGTH } from '../server/src/config'
import { ServerSettings, DEFAULT_SERVER_SETTINGS } from '../server/src/types'
import * as Storage from './storage'
import firebase from 'firebase/app'
import Config from './config'
import { Badge } from '../server/src/badges'
import produce from 'immer'
import { sendToDiscord } from './sendToDiscord'
import { HubConnection } from '@microsoft/signalr'

export interface State {
  firebaseApp: firebase.app.App;
  authenticated: boolean;
  checkedAuthentication: boolean;
  authenticationProvider?: string;
  mustVerifyEmail?: boolean;
  signalRHub?: HubConnection;

  hasDismissedAModal: boolean;

  hasRegistered: boolean;

  roomId?: string;
  userId?: string;
  userMap: { [userId: string]: MinimalUser };
  roomData: { [roomId: string]: Room };

  // A count of the current number of users in there
  // Each specific roomData entry maintains a `users` array with usernames
  presenceData: { [roomId: string]: number };

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
  presenceData: {},
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
export default produce((draft: State, action: Action) => {
  console.log('In reducer', action)

  draft.prepopulatedInput = undefined

  if (action.type === ActionType.ReceivedMyProfile) {
    draft.profileData = action.value
  }

  if (action.type === ActionType.ReceivedServerSettings) {
    draft.serverSettings = action.value
  }

  if (action.type === ActionType.UpdatedCurrentRoom) {
    const oldRoomId = draft.roomId
    draft.roomId = action.value.roomId
    draft.roomData = { ...draft.roomData, ...action.value.roomData }

    if (draft.roomId === 'entryway' || (draft.roomData[draft.roomId].mediaChat && !draft.hasDismissedAModal)) {
      // 2020 behavior: Show every time someone loads into the entryway (the starting room)
      // 2021 behavior: In order to fix videochat connection issues, forcing this on every reload
      //  was a hacky way to make sure that players always interacted with the page before we loaded videochat
      // 2022 behavior (for now): Just limit that to rooms with videochat, since we're making less of those.
      draft.activeModal = Modal.Welcome
    }

    // Add a local "you have moved to X room" message
    // Don't display if we're in the same room (issue 162)
    if (draft.roomData && draft.roomData[action.value.roomId]) {
      const room = draft.roomData[action.value.roomId]
      if (draft.roomId !== oldRoomId) {
        addMessage(draft, createMovedRoomMessage(room.shortName))
      } else {
        addMessage(draft, createSameRoomMessage(room.shortName))
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
    draft.roomData = { ...draft.roomData, ...action.value }
  }

  if (action.type === ActionType.UpdatedPresence) {
    Object.keys(action.value).forEach((roomId) => {
      if (draft.roomData[roomId]) {
        draft.roomData[roomId].users = action.value[roomId]
      }
      draft.presenceData[roomId] = action.value[roomId].length
    })
  }

  if (action.type === ActionType.PlayerConnected) {
    const user = action.value
    const roomData = draft.roomData[draft.roomId]
    if (roomData && roomData.users && !roomData?.users.includes(user.id)) {
      roomData.users.push(user.id)
      addMessage(draft, createConnectedMessage(user.id, draft.roomId, roomData.users.length))
    }
    draft.userMap[user.id] = user
  }

  if (action.type === ActionType.PlayerDisconnected) {
    const roomData = draft.roomData[draft.roomId]
    roomData.users = roomData.users.filter((u) => u !== action.value)
    addMessage(draft, createDisconnectedMessage(action.value, draft.roomId, roomData.users.length))
  }

  if (action.type === ActionType.PlayerEntered) {
    const roomData = draft.roomData[draft.roomId]
    if (roomData.users && !roomData.users.includes(action.value.name)) {
      roomData.users.push(action.value.name)
      addMessage(draft,
        createEnteredMessage(action.value.name, action.value.fromId, action.value.fromName, draft.roomId, roomData.users.length)
      )
    }
  }

  if (action.type === ActionType.PlayerLeft) {
    const roomData = draft.roomData[draft.roomId]
    roomData.users = roomData.users.filter((u) => u !== action.value.name)
    addMessage(draft, createLeftMessage(action.value.name, action.value.toId, action.value.toName, draft.roomId, roomData.users.length))
  }

  if (action.type === ActionType.ChatMessage) {
    addMessage(draft,
      createChatMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.CaptionMessage) {
    addMessage(draft,
      createCaptionMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.Whisper) {
    const whisperMessage = createWhisperMessage(action.value.name, action.value.message)
    addMessage(draft, whisperMessage)
    saveWhisper(draft, whisperMessage)
  }

  if (action.type === ActionType.ModMessage) {
    sendToDiscord({ username: draft.userMap[action.value.name].username, message: action.value.message })
    addMessage(
      draft,
      createModMessage(
        action.value.name,
        action.value.message,
        action.value.name === draft.userId
      )
    )
  }

  if (action.type === ActionType.DeleteMessage) {
    deleteMessage(draft, action.value.targetMessageId)
  }

  if (action.type === ActionType.Shout) {
    addMessage(draft,
      createShoutMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.Emote) {
    addMessage(draft,
      createEmoteMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.Dance) {
    addMessage(draft,
      createDanceMessage(action.value.messageId, action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.UserMap) {
    draft.userMap = { ...draft.userMap, ...action.value }

    // If the actively-viewed profile updated, do a clean fetch
    if (draft.visibleProfile && draft.userMap[draft.visibleProfile.id]) {
      fetchProfile(draft.visibleProfile.id)
    }
  }

  if (action.type === ActionType.PlayerBanned) {
    if (action.value.id === draft.userId) {
      draft.isBanned = true
    } else {
      draft.userMap[action.value.id].isBanned = true
      addMessage(draft, createErrorMessage('User ' + action.value.username + ' was banned!'))
    }
  }

  // This message is never received by the banned player.
  if (action.type === ActionType.PlayerUnbanned) {
    if (draft.userMap[action.value.id]) {
      draft.userMap[action.value.id].isBanned = false
    }
    addMessage(draft, createErrorMessage('User ' + action.value.username + ' was unbanned!'))
  }

  if (action.type === ActionType.UpdateProfileColor) {
    draft.userMap[draft.userId].nameColor = action.color

    if (action.color) {
      addMessage(draft, createErrorMessage('Your name color was changed to ' + action.color))
    } else {
      addMessage(draft, createErrorMessage('Your name color has changed back to its original state.'))
    }

    updateProfileColor(draft.userId, action.color)
  }

  if (action.type === ActionType.UpdateFontReward) {
    draft.userMap[draft.userId].fontReward = action.font

    // I'm following the pattern of the set colour but... I don't think the user sees these message, and they aren't errors, why do we do this?
    if (action.font) {
      addMessage(draft, createErrorMessage('You feel invigorated, and like you\'ve become more... ' + action.font))
    } else {
      addMessage(draft, createErrorMessage('You feel yourself return to your normal state, like you never went riddling to begin with.'))
    }

    updateFontReward(draft.userId, action.font)
  }

  if (action.type === ActionType.Error) {
    addMessage(draft, createErrorMessage(action.value))
  }

  if (action.type === ActionType.MediaReceivedSpeakingData) {
    draft.currentSpeaker = action.value
    if (action.value !== null && action.value !== draft.userId) {
      if (!draft.visibleSpeakers.find(([userId, _]) => userId === action.value)) {
        if (draft.visibleSpeakers.length < draft.numberOfFaces) {
          draft.visibleSpeakers.push([action.value, new Date()])
        } else {
          // Find the oldest speaker and replace them
          let oldestIndex = -1
          let oldestTime = new Date()
          for (let i = 0; i < draft.visibleSpeakers.length; i++) {
            if (draft.visibleSpeakers[i][1] < oldestTime) {
              oldestTime = draft.visibleSpeakers[i][1]
              oldestIndex = i
            }
          }
          draft.visibleSpeakers[oldestIndex] = [action.value, new Date()]
        }
      }
    }
  }

  if (action.type === ActionType.SetNumberOfFaces) {
    draft.numberOfFaces = action.value
  }

  if (action.type === ActionType.StartVideoChat) {
    draft.inMediaChat = true
  }

  if (action.type === ActionType.StopVideoChat) {
    // stopAudioAnalyserLoop()
    draft.inMediaChat = false
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    const messageId: string = uuidv4()
    const trimmedMessage = action.value.trim()
    const beginsWithSlash = /^\/.+?/.exec(trimmedMessage)
    const matching = beginsWithSlash ? matchingSlashCommand(trimmedMessage) : undefined

    if (trimmedMessage.length > MESSAGE_MAX_LENGTH) {
      addMessage(draft, createErrorMessage('Your message is too long! Please try to keep it under ~600 characters!'))
    } else if (beginsWithSlash && matching === undefined) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      addMessage(draft, createErrorMessage(`Your command ${commandStr ? commandStr[1] : action.value} is not a registered slash command!`))
    } else if (beginsWithSlash && matching.type === SlashCommandType.Whisper) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      const parsedUsernameMessage = /^(.+?) (.+)/.exec(commandStr[2])

      if (!parsedUsernameMessage) {
        addMessage(draft, createErrorMessage(`Your whisper to ${commandStr[2]} had no message!`))
      } else {
        sendChatMessage(messageId, trimmedMessage)

        const [_, username, message] = parsedUsernameMessage
        const user = Object.values(draft.userMap).find(
          (u) => u.username === username
        )
        const userId = user && user.id
        if (userId) {
          const whisperMessage = createWhisperMessage(userId, message, true)
          addMessage(draft, whisperMessage)
          saveWhisper(draft, whisperMessage)
        }
      }
    } else if (beginsWithSlash && matching.type === SlashCommandType.Help) {
      draft.activeModal = Modal.Help
      addMessage(draft, createCommandMessage('You consult the help docs. (You can also find them in sidebar!)'))
    } else if (beginsWithSlash && matching.type === SlashCommandType.Look) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      addMessage(draft, createCommandMessage(`You attempt to examine ${commandStr[2]}. (You can also click on their username and select Profile!)`))
      sendChatMessage(messageId, trimmedMessage)
    } else if (beginsWithSlash) {
      sendChatMessage(messageId, trimmedMessage)
    } else {
      sendChatMessage(messageId, action.value)
      addMessage(draft, createChatMessage(messageId, draft.userId, action.value))
    }
  }

  if (action.type === ActionType.SendCaption) {
    const messageId: string = uuidv4()
    sendCaption(messageId, action.value)
    addMessage(draft, createCaptionMessage(messageId, draft.userId, action.value))
  }

  if (action.type === ActionType.StartWhisper) {
    draft.prepopulatedInput = `/whisper ${action.value} `
  }

  if (action.type === ActionType.HideModalAction) {
    draft.activeModal = Modal.None
    draft.hasDismissedAModal = true
  }

  if (action.type === ActionType.ShowProfile) {
    draft.visibleProfile = action.value
  }

  if (action.type === ActionType.HideProfile) {
    draft.visibleProfile = null
  }

  if (action.type === ActionType.ShowModal) {
    draft.activeModal = action.value
    draft.activeModalOptions = {}
  }

  if (action.type === ActionType.ShowModalWithOptions) {
    console.log('Showing', action)
    draft.activeModal = action.value.modal
    draft.activeModalOptions = action.value.options
  }

  if (action.type === ActionType.ShowSideMenu) {
    draft.mobileSideMenuIsVisible = true
  }

  if (action.type === ActionType.HideSideMenu) {
    draft.mobileSideMenuIsVisible = false
  }

  if (action.type === ActionType.DeactivateAutoscroll) {
    draft.autoscrollChat = false
  }

  if (action.type === ActionType.ActivateAutoscroll) {
    draft.autoscrollChat = true
  }

  if (action.type === ActionType.SetUseSimpleNames) {
    draft.useSimpleNames = action.value
    Storage.setUseSimpleNames(action.value)
  }

  if (action.type === ActionType.SetKeepCameraWhenMoving) {
    draft.keepCameraWhenMoving = action.value
    Storage.setKeepCameraWhenMoving(action.value)
  }

  if (action.type === ActionType.SetCaptionsEnabled) {
    draft.captionsEnabled = action.value
    Storage.setCaptionsEnabled(action.value)
  }

  if (action.type === ActionType.SetTextOnlyMode) {
    draft.textOnlyMode = action.textOnlyMode
    if (!action.refresh) {
      Storage.setTextOnlyMode(action.textOnlyMode)
    } else {
      Storage.setTextOnlyMode(action.textOnlyMode).then(() => window.location.reload())
    }
  }

  if (action.type === ActionType.SetAudioOnlyMode) {
    draft.audioOnlyMode = action.value
  }

  if (action.type === ActionType.Authenticate) {
    draft.checkedAuthentication = true

    draft.authenticationProvider = action.value.provider
    draft.mustVerifyEmail = action.value.mustVerifyEmail

    if (action.value.userId && action.value.name) {
      draft.authenticated = true
      draft.userId = action.value.userId

      // If you haven't registered yet, we need to grab your username before we've pulled a server userMap
      draft.userMap[action.value.userId] = {
        id: action.value.userId,
        username: action.value.name
      }
    } else {
      draft.authenticated = undefined
      draft.userId = undefined
    }
  }

  if (action.type === ActionType.IsRegistered) {
    draft.hasRegistered = true
  }

  if (action.type === ActionType.BanToggle) {
    toggleUserBan(action.value)
  }

  if (action.type === ActionType.ModToggle) {
    toggleUserMod(action.value)
  }

  if (action.type === ActionType.LoadMessageArchive) {
    draft.messages = action.messages
    draft.whispers = action.whispers || []
  }

  // Notes
  if (action.type === ActionType.NoteAdd) {
    const room = draft.roomData && draft.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      if (!room.notes) room.notes = []

      room.notes.push(action.value.note)
    }
  }

  if (action.type === ActionType.NoteRemove) {
    const room = draft.roomData && draft.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      if (!room.notes) room.notes = []

      room.notes = room.notes.filter(n => n.id !== action.value.noteId)
    }
  }

  if (action.type === ActionType.NoteUpdateLikes) {
    const room = draft.roomData && draft.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      if (!room.notes) room.notes = []

      const note = room.notes.find(n => n.id === action.value.noteId)
      if (note) {
        note.likes = action.value.likes
      }
    }
  }

  if (action.type === ActionType.NoteUpdateRoom) {
    const room = draft.roomData && draft.roomData[action.value.roomId]
    if (room.hasNoteWall) {
      room.notes = action.value.notes
    }
  }

  if (action.type === ActionType.SpaceIsClosed) {
    draft.isClosed = true
  }

  if (action.type === ActionType.SpaceOpenedOrClosed) {
    if (draft.userMap[draft.userId].isMod) {
      draft.isClosed = action.value
      addMessage(draft, createCommandMessage(`The space is now ${action.value ? 'closed' : 'open'}`))
    } else {
      // Not reloading the page will show the 'go home' screen, but will still send SignalR data
      // Just hard-reloading the page will stop them from getting messages
      window.location.reload()
    }
  }

  if (action.type === ActionType.CommandMessage) {
    const message = createCommandMessage(action.value)
    addMessage(draft, message)
  }

  if (action.type === ActionType.EquipBadge) {
    if (!draft.profileData.equippedBadges) {
      draft.profileData.equippedBadges = []
    }
    draft.profileData.equippedBadges[action.value.index] = action.value.badge
  }

  if (action.type === ActionType.UnlockBadge) {
    draft.profileData.unlockedBadges.push(action.value)
    draft.justUnlockedBadge = action.value
    draft.activeModal = Modal.BadgeUnlock
  }

  if (action.type === ActionType.SetUnlockedBadges) {
    draft.profileData.unlockedBadges = action.value
  }

  if (action.type === ActionType.UpdateUnlockableBadges) {
    draft.unlockableBadges = action.value
  }

  if (action.type === ActionType.SignalRHubCreated) {
    draft.signalRHub = action.value
  }
})

// WARNING: These three functions modify the message state without awaiting on the result.
// If you're seeing weird race conditions with the message store, that's probably the issue.

function deleteMessage (state: State, messageId: String) {
  const target = state.messages.find(m => isDeletableMessage(m) && m.id === messageId)

  // Calling isDeletable again here so TypeScript can properly cast; if there's a nicer way to do this, please inform!
  if (isDeletableMessage(target)) {
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
  state.messages = state.messages.slice(-500)
  Storage.setMessages(state.messages)
}

// This is intended to be a big old unreadable grab bag,
// but seems better than alternatives
export interface ModalOptions {
    hideVideo?: boolean,
    showJoinButton?: boolean
}
