import { Badge } from '../server/src/badges.js'
import { MESSAGE_MAX_LENGTH } from '../server/src/config.js'
import { RoomNote } from '../server/src/roomNote.js'
import { ServerSettings } from '../server/src/types.js'
import { MinimalUser, PublicUser, User } from '../server/src/user.js'
import { uuid } from '../server/src/utils.js'

import { Message, WhisperMessage } from './message/index.js'
import { Modal } from './modals.js'
import { connectRoomData, fetchProfile, sendChatMessage, updateFontReward, updateProfileColor } from './networking.js'
import { ModalOptions, PresenceListMap, RoomDataMap, State, UserMap } from './reducer.js'
import { myUserId } from './selectors.js'
import { matchingSlashCommand, SlashCommandType } from './SlashCommands.js'
import { Thunk } from './useReducerWithThunk.js'
import { fps } from './utils.js'

export type Action =
  | ReceivedMyProfileAction
  | ReceivedServerSettingsAction
  | UpdatedCurrentRoomAction
  | ConnectedAction
  | UpdatedRoomDataAction
  | UpdatedPresenceAction
  | PlayerConnectedAction
  | PlayerDisconnectedAction
  | ChatMessageAction
  | ModMessageAction
  | DeleteMessageAction
  | ChatReadyAction
  | LoadMessageArchiveActionStart
  | LoadMessageArchiveActionEnd
  | LoadMessageAction
  | WhisperAction
  | ShoutAction
  | EmoteAction
  | DanceAction
  | PlayerEnteredAction
  | PlayerLeftAction
  | UserMapLocalAction
  | PlayerBannedAction
  | PlayerUnbannedAction
  | UpdateProfileColorLocalAction
  | ErrorAction
  | SetNameAction
  | ShowProfileAction
  | ShowModalAction
  | ShowModalWithOptionsAction
  | AuthenticateAction
  | IsRegisteredAction
  | NoteAddAction
  | NoteRemoveAction
  | NoteUpdateLikesAction
  | NoteUpdateRoomAction
  | ObeliskNoteAddAction
  | ObeliskNoteRemoveAction
  | ObeliskNoteUpdateLikesAction
  | ObeliskNoteUpdateAction
  | HideModalAction
  | HideProfileAction
  | ShowSideMenuAction
  | HideSideMenuAction
  | DeactivateAutoscrollAction
  | ActivateAutoscrollAction
  | SetUseSimpleNamesAction
  | SetShowDebugControlsAction
  | SpaceIsClosedAction
  | SpaceOpenedOrClosedAction
  | CommandMessageAction
  | UpdateFontRewardLocalAction
  | EquipBadgeAction
  | UpdateUnlockableBadgesAction
  | UnlockBadgeAction
  | SetUnlockedBadgesAction

export enum ActionType {
  // Server-driven action
  ReceivedMyProfile = 'RECEIVED_MY_PROFILE',
  ReceivedServerSettings = 'RECEIVED_SERVER_SETTINGS',
  UpdatedCurrentRoom = 'UPDATED_CURRENT_ROOM',
  Connected = 'CONNECTED',
  UpdatedRoomData = 'UPDATED_ROOM_DATA',
  UpdatedPresence = 'UPDATED_PRESENCE',
  PlayerConnected = 'PLAYER_CONNECTED',
  PlayerDisconnected = 'PLAYER_DISCONNECTED',
  ChatMessage = 'CHAT_MESSAGE',
  ModMessage = 'MOD_MESSAGE',
  DeleteMessage = 'DELETE_MESSAGE',
  Whisper = 'WHISPER',
  Shout = 'SHOUT',
  Emote = 'EMOTE',
  Dance = 'DANCE',
  PlayerEntered = 'PLAYER_ENTERED',
  PlayerLeft = 'PLAYER_LEFT',
  Error = 'ERROR',
  // eslint-disable-next-line @typescript-eslint/no-shadow -- it's an enum member, not a var
  UserMap = 'USER_MAP',
  PlayerBanned = 'PLAYER_BANNED',
  PlayerUnbanned = 'PLAYER_UNBANNED',
  UpdateProfileColor = 'UPDATE_PROFILE_COLOR',
  UpdateFontReward = 'UPDATE_FONT_REWARD',
  // UI actions
  SetName = 'SET_NAME',
  ShowProfile = 'SHOW_PROFILE',
  HideProfile = 'HIDE_PROFILE',
  ShowModal = 'SHOW_MODAL',
  ShowModalWithOptions = 'SHOW_MODAL_WITH_OPTIONS',
  ShowSideMenu = 'SHOW_SIDE_MENU',
  HideSideMenu = 'HIDE_SIDE_MENU',
  DeactivateAutoscroll = 'DEACTIVATE_AUTOSCROLL',
  ActivateAutoscroll = 'ACTIVATE_AUTOSCROLL',
  SetUseSimpleNames = 'SET_USE_SIMPLE_NAMES',
  SetShowDebugControls = 'SET_SHOW_DEBUG_CONTROLS',
  //
  Authenticate = 'AUTHENTICATE',
  IsRegistered = 'IS_REGISTERED',
  ChatReady = 'CHAT_READY',
  LoadMessageArchiveStart = 'LOAD_MESSAGE_ARCHIVE_START',
  LoadMessageArchiveEnd = 'LOAD_MESSAGE_ARCHIVE_END',
  LoadMessage = 'LOAD_MESSAGE',
  // Note Wall
  NoteAdd = 'NOTE_ADD',
  NoteRemove = 'NOTE_REMOVE',
  NoteUpdateLikes = 'NOTE_UPDATE_LIKES',
  NoteUpdateRoom = 'NOTE_UPDATE_ROOM',

  // Sidebar obelisk
  ObeliskNoteAdd = 'OBELISK_NOTE_ADD', // Add a single note
  ObeliskNoteUpdate = 'OBELISK_NOTE_UPDATE', // Bulk update notes
  ObeliskNoteRemove = 'OBELISK_NOTE_REMOVE',
  ObeliskNoteUpdateLikes = 'OBELISK_NOTE_UPDATE_LIKES',

  // eslint-disable-next-line @typescript-eslint/no-shadow -- it's an enum member, not a var
  HideModalAction = 'HIDE_MODAL',

  SpaceIsClosed = 'SPACE_IS_CLOSED',
  SpaceOpenedOrClosed = 'SPACE_OPENED_OR_CLOSED',

  CommandMessage = 'COMMAND_MESSAGE',

  EquipBadge = 'EQUIP_BADGE',
  UnlockBadge = 'UNLOCK_BADGE',
  UpdateUnlockableBadges = 'UPDATE_UNLOCKABLE_BADGES',
  SetUnlockedBadges = 'SET_UNLOCKED_BADGES',
}

interface ReceivedMyProfileAction {
  type: ActionType.ReceivedMyProfile;
  value: User;
}

export const ReceivedMyProfileAction = (
  user: User
): ReceivedMyProfileAction => {
  return {
    type: ActionType.ReceivedMyProfile,
    value: user
  }
}

interface ReceivedServerSettingsAction {
  type: ActionType.ReceivedServerSettings;
  value: ServerSettings;
}

export const ReceivedServerSettingsAction = (
  serverSettings: ServerSettings
): ReceivedServerSettingsAction => {
  return {
    type: ActionType.ReceivedServerSettings,
    value: serverSettings
  }
}

interface UpdatedCurrentRoomAction {
  type: ActionType.UpdatedCurrentRoom;
  value: {
    roomId: string;
    roomData: RoomDataMap;
    /** Whether user just spawned from an initial connection. */
    isSpawn: boolean;
  };
}

export const UpdatedCurrentRoomAction = (
  roomId: string,
  roomData: RoomDataMap,
  isSpawn = false
): UpdatedCurrentRoomAction => ({
  type: ActionType.UpdatedCurrentRoom,
  value: { roomId, roomData, isSpawn }
})

interface ConnectedAction {
  type: ActionType.Connected;
}

export const ConnectedAction = (): ConnectedAction => ({
  type: ActionType.Connected
})

interface ChatReadyAction {
  type: ActionType.ChatReady;
}

export const ChatReadyAction = (): ChatReadyAction => ({
  type: ActionType.ChatReady
})

export const ConnectAction =
  (
    roomId: string,
    roomData: RoomDataMap,
    presenceData?: PresenceListMap,
    roomNotes?: RoomNote[]
  ): Thunk<Action, State> =>
    async (dispatch, getState) => {
      await getState().messageArchiveLoaded.promise
      dispatch(UpdatedCurrentRoomAction(roomId, roomData, true))
      if (presenceData) {
        dispatch(UpdatedPresenceAction(presenceData))
      }
      if (roomNotes) {
        dispatch(NoteUpdateRoomAction(roomId, roomNotes))
      }
      dispatch(ConnectedAction())
    }

interface UpdatedRoomDataAction {
  type: ActionType.UpdatedRoomData;
  value: RoomDataMap;
}

export const UpdatedRoomDataAction = (roomData: RoomDataMap): UpdatedRoomDataAction => {
  return {
    type: ActionType.UpdatedRoomData,
    value: roomData
  }
}

interface UpdatedPresenceAction {
  type: ActionType.UpdatedPresence;
  value: PresenceListMap;
}

export const UpdatedPresenceAction = (data: PresenceListMap): UpdatedPresenceAction => {
  return {
    type: ActionType.UpdatedPresence,
    value: data
  }
}

interface PlayerConnectedAction {
  type: ActionType.PlayerConnected;
  value: MinimalUser;
}

export const PlayerConnectedAction = (
  user: MinimalUser
): PlayerConnectedAction => {
  return {
    type: ActionType.PlayerConnected,
    value: user
  }
}

interface PlayerDisconnectedAction {
  type: ActionType.PlayerDisconnected;
  value: string;
}

export const PlayerDisconnectedAction = (
  name: string
): PlayerDisconnectedAction => {
  return {
    type: ActionType.PlayerDisconnected,
    value: name
  }
}

interface ChatMessageAction {
  type: ActionType.ChatMessage;
  value: {
    messageId: string;
    name: string;
    message: string;
  };
}

export const ChatMessageAction = (
  messageId: string,
  name: string,
  message: string
): ChatMessageAction => {
  return {
    type: ActionType.ChatMessage,
    value: { messageId, name, message }
  }
}

interface WhisperAction {
  type: ActionType.Whisper;
  value: {
    name: string;
    message: string;
    senderIsSelf: boolean;
  };
}

export const WhisperAction = (name: string, message: string, senderIsSelf = false): WhisperAction => {
  return {
    type: ActionType.Whisper,
    value: { name, message, senderIsSelf }
  }
}

interface ModMessageAction {
  type: ActionType.ModMessage;
  value: {
    name: string;
    message: string;
  };
}

export const ModMessageAction = (
  name: string,
  message: string
): ModMessageAction => {
  return {
    type: ActionType.ModMessage,
    value: { name, message }
  }
}

interface DeleteMessageAction {
  type: ActionType.DeleteMessage;
  value: {
    modId: string;
    targetMessageId: string;
  };
}

export const DeleteMessageAction = (
  modId: string,
  targetMessageId: string
): DeleteMessageAction => {
  return {
    type: ActionType.DeleteMessage,
    value: { modId, targetMessageId }
  }
}

export const ShoutAction = (
  messageId: string,
  name: string,
  message: string
): ShoutAction => {
  return {
    type: ActionType.Shout,
    value: { messageId, name, message }
  }
}

interface ShoutAction {
  type: ActionType.Shout;
  value: {
    messageId: string;
    name: string;
    message: string;
  };
}

interface EmoteAction {
  type: ActionType.Emote;
  value: {
    messageId: string;
    name: string;
    message: string;
  };
}

export const EmoteAction = (
  messageId: string,
  name: string,
  message: string
): EmoteAction => {
  return {
    type: ActionType.Emote,
    value: { messageId, name, message }
  }
}

interface DanceAction {
  type: ActionType.Dance;
  value: {
    messageId: string;
    name: string;
    message: string;
  };
}

export const DanceAction = (
  messageId: string,
  name: string,
  message: string
): DanceAction => {
  return {
    type: ActionType.Dance,
    value: { messageId, name, message }
  }
}

interface PlayerEnteredAction {
  type: ActionType.PlayerEntered;
  value: {
    name: string;
    fromId: string;
    fromName: string;
  };
}

export const PlayerEnteredAction = (
  name: string,
  fromId: string,
  fromName: string
): PlayerEnteredAction => {
  return {
    type: ActionType.PlayerEntered,
    value: { name, fromId, fromName }
  }
}

interface PlayerLeftAction {
  type: ActionType.PlayerLeft;
  value: {
    name: string;
    toId: string;
    toName: string;
  };
}

export const PlayerLeftAction = (
  name: string,
  toId: string,
  toName: string
): PlayerLeftAction => {
  return {
    type: ActionType.PlayerLeft,
    value: { name, toId, toName }
  }
}

interface UserMapLocalAction {
  type: ActionType.UserMap;
  value: UserMap;
}

const UserMapLocalAction = (map: UserMap): UserMapLocalAction => {
  return {
    type: ActionType.UserMap,
    value: map
  }
}

export const UserMapAction = (map: UserMap): Thunk<Action, State> =>
  (dispatch, getState) => {
    dispatch(UserMapLocalAction(map))

    // If the actively-viewed profile updated, do a clean fetch
    const { visibleProfile, userMap } = getState()
    if (visibleProfile && (map[visibleProfile.id] ?? userMap[visibleProfile.id])) {
      fetchProfile(visibleProfile.id)
    }
  }

interface PlayerBannedAction {
  type: ActionType.PlayerBanned;
  value: MinimalUser;
}

export const PlayerBannedAction = (user: MinimalUser): PlayerBannedAction => {
  return {
    type: ActionType.PlayerBanned,
    value: user
  }
}

interface PlayerUnbannedAction {
  type: ActionType.PlayerUnbanned;
  value: MinimalUser;
}

export const PlayerUnbannedAction = (
  user: MinimalUser
): PlayerUnbannedAction => {
  return {
    type: ActionType.PlayerUnbanned,
    value: user
  }
}

// *LocalAction actions update only local state, for the reducer. The exported thunks
// also update the server; reducers must be pure and not make network calls themselves.

interface UpdateProfileColorLocalAction {
  type: ActionType.UpdateProfileColor;
  color: string | undefined;
}

const UpdateProfileColorLocalAction = (
  color: string | undefined
): UpdateProfileColorLocalAction => {
  return {
    type: ActionType.UpdateProfileColor,
    color: color
  }
}

export const UpdateProfileColorAction = (color: string | undefined): Thunk<Action, State> =>
  (dispatch, getState) => {
    dispatch(UpdateProfileColorLocalAction(color))
    updateProfileColor(myUserId(getState()), color)
  }

interface UpdateFontRewardLocalAction {
  type: ActionType.UpdateFontReward;
  font: string;
}

const UpdateFontRewardLocalAction = (
  font: string
): UpdateFontRewardLocalAction => {
  return {
    type: ActionType.UpdateFontReward,
    font: font
  }
}

export const UpdateFontRewardAction = (font: string): Thunk<Action, State> =>
  (dispatch, getState) => {
    dispatch(UpdateFontRewardLocalAction(font))
    updateFontReward(myUserId(getState()), font)
  }

interface ErrorAction {
  type: ActionType.Error;
  value: string;
}

export const ErrorAction = (error: string): ErrorAction => {
  return {
    type: ActionType.Error,
    value: error
  }
}

// UI Actions

/** Sends a chat message or slash command typed by the user, and shows its local results. */
export const SendMessageAction = (message: string): Thunk<Action, State> =>
  (dispatch, getState) => {
    const state = getState()
    const messageId: string = uuid()
    const trimmedMessage = message.trim()
    const beginsWithSlash = /^\/.+?/.exec(trimmedMessage)
    const matching = beginsWithSlash
      ? matchingSlashCommand(trimmedMessage)
      : undefined

    if (trimmedMessage.length > MESSAGE_MAX_LENGTH) {
      dispatch(ErrorAction('Your message is too long! Please try to keep it under ~600 characters!'))
    } else if (beginsWithSlash && matching === undefined) {
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)
      dispatch(ErrorAction(
        `Your command ${commandStr ? commandStr[1] : message} is not a registered slash command!`
      ))
    } else if (matching && !matching.noArgs && !trimmedMessage.includes(' ')) {
      // Bare command with no argument, like just "/whisper"
      dispatch(ErrorAction(`Usage: ${trimmedMessage} ${matching.usageMsgArgs}`))
    } else if (beginsWithSlash && matching?.type === SlashCommandType.Whisper) {
      // Can't be null, by construction: bare command with no arg was caught by usage-hint
      // branch above.
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)!
      const parsedUsernameMessage = /^(.+?) (.+)/.exec(commandStr[2])

      if (!parsedUsernameMessage) {
        dispatch(ErrorAction(`Your whisper to ${commandStr[2]} had no message!`))
      } else {
        sendChatMessage(messageId, trimmedMessage, state.roomId)

        const [, username, whisperText] = parsedUsernameMessage
        const user = Object.values(state.userMap).find(
          (u) => u.username === username
        )
        if (user) {
          dispatch(WhisperAction(user.id, whisperText, true))
        }
      }
    } else if (beginsWithSlash && matching?.type === SlashCommandType.Help) {
      dispatch(ShowModalAction(Modal.Help))
      dispatch(CommandMessageAction('You consult the help docs. (You can also find them in the sidebar!)'))
    } else if (beginsWithSlash && matching?.type === SlashCommandType.Look) {
      // Can't be null, by construction: bare command with no arg was caught by usage-hint
      // branch above.
      const commandStr = /^(\/.+?) (.+)/.exec(trimmedMessage)!
      dispatch(CommandMessageAction(
        `You attempt to examine ${commandStr[2]}. (You can also click on their username and select Profile!)`
      ))
      sendChatMessage(messageId, trimmedMessage, state.roomId)
    } else if (beginsWithSlash) {
      sendChatMessage(messageId, trimmedMessage, state.roomId)
    } else {
      sendChatMessage(messageId, message, state.roomId)
      dispatch(ChatMessageAction(messageId, myUserId(state), message))
    }
  }

interface SetNameAction {
  type: ActionType.SetName;
  value: string;
}

export const SetNameAction = (name: string): SetNameAction => {
  return {
    type: ActionType.SetName,
    value: name
  }
}

interface HideProfileAction {
  type: ActionType.HideProfile;
}

export const HideProfileAction = (): HideProfileAction => {
  return { type: ActionType.HideProfile }
}

interface ShowProfileAction {
  type: ActionType.ShowProfile;
  value: PublicUser;
}

export const ShowProfileAction = (user: PublicUser): ShowProfileAction => {
  return {
    type: ActionType.ShowProfile,
    value: user
  }
}

interface ShowModalAction {
  type: ActionType.ShowModal;
  value: Modal;
}

export const ShowModalAction = (modal: Modal): ShowModalAction => {
  return {
    type: ActionType.ShowModal,
    value: modal
  }
}

interface ShowModalWithOptionsAction {
  type: ActionType.ShowModalWithOptions;
  value: {
    modal: Modal;
    options: ModalOptions;
  };
}

export const ShowModalWithOptionsAction = (
  modal: Modal,
  options: ModalOptions
): ShowModalWithOptionsAction => {
  return {
    type: ActionType.ShowModalWithOptions,
    value: { modal, options }
  }
}

interface HideModalAction {
  type: ActionType.HideModalAction;
}

export const HideModalAction = (): HideModalAction => {
  return { type: ActionType.HideModalAction }
}

interface ShowSideMenuAction {
  type: ActionType.ShowSideMenu;
}

export const ShowSideMenuAction = (): ShowSideMenuAction => {
  return { type: ActionType.ShowSideMenu }
}

interface HideSideMenuAction {
  type: ActionType.HideSideMenu;
}

export const HideSideMenuAction = (): HideSideMenuAction => {
  return { type: ActionType.HideSideMenu }
}

interface DeactivateAutoscrollAction {
  type: ActionType.DeactivateAutoscroll;
}

export const DeactivateAutoscrollAction = (): DeactivateAutoscrollAction => {
  return { type: ActionType.DeactivateAutoscroll }
}

interface ActivateAutoscrollAction {
  type: ActionType.ActivateAutoscroll;
}

export const ActivateAutoscrollAction = (): ActivateAutoscrollAction => {
  return { type: ActionType.ActivateAutoscroll }
}

interface SetUseSimpleNamesAction {
  type: ActionType.SetUseSimpleNames;
  value: boolean;
}

export const SetUseSimpleNamesAction = (
  useSimpleNames: boolean
): SetUseSimpleNamesAction => {
  return { type: ActionType.SetUseSimpleNames, value: useSimpleNames }
}

interface SetShowDebugControlsAction {
  type: ActionType.SetShowDebugControls;
  value: boolean;
}

export const SetShowDebugControlsAction = (
  showDebugControls: boolean
): SetShowDebugControlsAction => {
  return { type: ActionType.SetShowDebugControls, value: showDebugControls }
}

interface AuthenticateAction {
  type: ActionType.Authenticate;
  value: {
    name: string | undefined;
    userId: string | undefined;
    provider: string | undefined;
    mustVerifyEmail: boolean | undefined;
  };
}

export const AuthenticateAction = (
  userId: string | undefined,
  name: string | undefined,
  provider: string | undefined,
  mustVerifyEmail: boolean | undefined
): AuthenticateAction => {
  return {
    type: ActionType.Authenticate,
    value: { userId, name, provider, mustVerifyEmail }
  }
}

interface IsRegisteredAction {
  type: ActionType.IsRegistered;
}

export const IsRegisteredAction = (): IsRegisteredAction => {
  return { type: ActionType.IsRegistered }
}

interface LoadMessageArchiveActionStart {
  type: ActionType.LoadMessageArchiveStart;
  whispers: WhisperMessage[];
}

const LoadMessageArchiveActionStart = (
  whispers: WhisperMessage[]
): LoadMessageArchiveActionStart => ({
  type: ActionType.LoadMessageArchiveStart,
  whispers
})

interface LoadMessageArchiveActionEnd {
  type: ActionType.LoadMessageArchiveEnd;
}

const LoadMessageArchiveActionEnd = (): LoadMessageArchiveActionEnd => ({
  type: ActionType.LoadMessageArchiveEnd
})

export const LoadMessageArchiveAction =
  (
    messages: Message[] | null,
    whispers: WhisperMessage[] | null
  ): Thunk<Action, State> =>
    async (dispatch, getState) => {
      await getState().chatReady.promise

      dispatch(LoadMessageArchiveActionStart(whispers ?? []))

      await (messages?.length
        ? messages.reduce(
          (acc, message, i) =>
            acc.then(
              () =>
                new Promise((resolve) =>
                  setTimeout(() => {
                    dispatch(
                      LoadMessageAction(message, (i + 1) / messages.length)
                    )
                    resolve()
                  }, fps(60))
                )
            ),
          Promise.resolve()
        )
        : new Promise<void>((resolve) =>
          setTimeout(() => {
            dispatch(LoadMessageAction(null, 1))
            resolve()
          }, fps(60))
        ))

      dispatch(LoadMessageArchiveActionEnd())
      // connectRoomData() calls AzFn connect which needs an open websocket, so wait until
      // connect() has finished. (See #1086.) Order matters: this wait must come after
      // LoadMessageArchiveActionEnd, or it can deadlock with ConnectAction, which waits on
      // the archive load.
      await getState().connected.promise
      connectRoomData(dispatch)
    }

interface LoadMessageAction {
  type: ActionType.LoadMessage;
  message: Message | null;
  progress: number;
}

const LoadMessageAction = (
  message: Message | null,
  progress: number
): LoadMessageAction => ({
  type: ActionType.LoadMessage,
  message,
  progress
})

interface NoteAddAction {
  type: ActionType.NoteAdd;
  value: { roomId: string; note: RoomNote };
}

export const NoteAddAction = (
  roomId: string,
  note: RoomNote
): NoteAddAction => {
  return { type: ActionType.NoteAdd, value: { roomId, note } }
}

interface NoteRemoveAction {
  type: ActionType.NoteRemove;
  value: { roomId: string; noteId: string };
}

export const NoteRemoveAction = (
  roomId: string,
  noteId: string
): NoteRemoveAction => {
  return { type: ActionType.NoteRemove, value: { roomId, noteId } }
}

interface NoteUpdateLikesAction {
  type: ActionType.NoteUpdateLikes;
  value: { roomId: string; noteId: string; likes: string[] };
}

export const NoteUpdateLikesAction = (
  roomId: string,
  noteId: string,
  likes: string[]
): NoteUpdateLikesAction => {
  return { type: ActionType.NoteUpdateLikes, value: { roomId, noteId, likes } }
}

interface NoteUpdateRoomAction {
  type: ActionType.NoteUpdateRoom;
  value: { roomId: string; notes: RoomNote[] };
}

export const NoteUpdateRoomAction = (
  roomId: string,
  notes: RoomNote[]
): NoteUpdateRoomAction => {
  return { type: ActionType.NoteUpdateRoom, value: { roomId, notes } }
}

//

interface ObeliskNoteUpdateAction {
  type: ActionType.ObeliskNoteUpdate;
  value: RoomNote[];
}

export const ObeliskNoteUpdateAction = (
  notes: RoomNote[]
): ObeliskNoteUpdateAction => {
  return { type: ActionType.ObeliskNoteUpdate, value: notes }
}
interface ObeliskNoteAddAction {
  type: ActionType.ObeliskNoteAdd;
  value: RoomNote;
}

export const ObeliskNoteAddAction = (
  note: RoomNote
): ObeliskNoteAddAction => {
  return { type: ActionType.ObeliskNoteAdd, value: note }
}

interface ObeliskNoteRemoveAction {
  type: ActionType.ObeliskNoteRemove;
  value: string; // noteId
}

export const ObeliskNoteRemoveAction = (
  noteId: string
): ObeliskNoteRemoveAction => {
  return { type: ActionType.ObeliskNoteRemove, value: noteId }
}

interface ObeliskNoteUpdateLikesAction {
  type: ActionType.ObeliskNoteUpdateLikes;
  value: { noteId: string; likes: string[] };
}

export const ObeliskNoteUpdateLikesAction = (
  noteId: string,
  likes: string[]
): ObeliskNoteUpdateLikesAction => {
  return { type: ActionType.ObeliskNoteUpdateLikes, value: { noteId, likes } }
}

//

interface SpaceIsClosedAction {
  type: ActionType.SpaceIsClosed;
}

export const SpaceIsClosedAction = (): SpaceIsClosedAction => {
  return { type: ActionType.SpaceIsClosed }
}

interface SpaceOpenedOrClosedAction {
  type: ActionType.SpaceOpenedOrClosed;
  value: boolean;
}

export const SpaceOpenedOrClosedAction = (
  value: boolean
): SpaceOpenedOrClosedAction => {
  return { type: ActionType.SpaceOpenedOrClosed, value }
}

interface CommandMessageAction {
  type: ActionType.CommandMessage;
  value: string;
}

export const CommandMessageAction = (message: string): CommandMessageAction => {
  return {
    type: ActionType.CommandMessage,
    value: message
  }
}

interface EquipBadgeAction {
  type: ActionType.EquipBadge;
  value: { badge: Badge | undefined; index: number };
}

export const EquipBadgeAction = (
  badge: Badge | undefined,
  index: number
): EquipBadgeAction => {
  return {
    type: ActionType.EquipBadge,
    value: { badge, index }
  }
}

interface UnlockBadgeAction {
  type: ActionType.UnlockBadge;
  value: Badge;
}

export const UnlockBadgeAction = (badge: Badge): UnlockBadgeAction => {
  return {
    type: ActionType.UnlockBadge,
    value: badge
  }
}

interface SetUnlockedBadgesAction {
  type: ActionType.SetUnlockedBadges;
  value: Badge[];
}

export const SetUnlockedBadgesAction = (
  badges: Badge[]
): SetUnlockedBadgesAction => {
  return {
    type: ActionType.SetUnlockedBadges,
    value: badges
  }
}

interface UpdateUnlockableBadgesAction {
  type: ActionType.UpdateUnlockableBadges;
  value: Badge[];
}

export const UpdateUnlockableBadgesAction = (
  badges: Badge[]
): UpdateUnlockableBadgesAction => {
  return {
    type: ActionType.UpdateUnlockableBadges,
    value: badges
  }
}
