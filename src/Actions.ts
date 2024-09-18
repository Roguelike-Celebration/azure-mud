import { Badge } from '../server/src/badges'
import { RoomNote } from '../server/src/roomNote'
import { ServerSettings } from '../server/src/types'
import { MinimalUser, PublicUser, User } from '../server/src/user'
import { Message, WhisperMessage } from './message'
import { Modal } from './modals'
import { connectRoomData } from './networking'
import { ModalOptions, State } from './reducer'
import { Room } from './room'
import { Thunk } from './useReducerWithThunk'
import { fps } from './utils'

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
  | CaptionMessageAction
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
  | UserMapAction
  | PlayerBannedAction
  | PlayerUnbannedAction
  | UpdateProfileColorAction
  | MediaReceivedSpeakingDataAction
  | StopVideoChatAction
  | StartVideoChatAction
  | ErrorAction
  | RefreshReactAction
  | SendMessageAction
  | SendCaptionAction
  | SetNameAction
  | StartWhisperAction
  | ShowProfileAction
  | ShowModalAction
  | ShowModalWithOptionsAction
  | SetUserIdAction
  | IsRegisteredAction
  | BanToggleAction
  | ModToggleAction
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
  | SetKeepCameraWhenMovingAction
  | SetTextOnlyModeAction
  | SetAudioOnlyModeAction
  | SetNumberOfFacesAction
  | SetCaptionsEnabledAction
  | SpaceIsClosedAction
  | SpaceOpenedOrClosedAction
  | CommandMessageAction
  | UpdateFontRewardAction
  | EquipBadgeAction
  | UpdateUnlockableBadgesAction
  | UnlockBadgeAction
  | SetUnlockedBadgesAction;

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
  CaptionMessage = 'CAPTION_MESSAGE',
  ModMessage = 'MOD_MESSAGE',
  DeleteMessage = 'DELETE_MESSAGE',
  Whisper = 'WHISPER',
  Shout = 'SHOUT',
  Emote = 'EMOTE',
  Dance = 'DANCE',
  PlayerEntered = 'PLAYER_ENTERED',
  PlayerLeft = 'PLAYER_LEFT',
  Error = 'ERROR',
  UserMap = 'USER_MAP',
  PlayerBanned = 'PLAYER_BANNED',
  PlayerUnbanned = 'PLAYER_UNBANNED',
  UpdateProfileColor = 'UPDATE_PROFILE_COLOR',
  UpdateFontReward = 'UPDATE_FONT_REWARD',
  // WebRTC
  StopVideoChat = 'STOP_VIDEO_CHAT',
  StartVideoChat = 'START_VIDEO_CHAT',
  MediaReceivedSpeakingData = 'MEDIA_RECEIVED_SPEAKING_DATA',
  // UI actions
  RefreshReact = 'REFRESH_REACT',
  SendMessage = 'SEND_MESSAGE',
  SendCaption = 'SEND_CAPTION',
  SetName = 'SET_NAME',
  StartWhisper = 'START_WHISPER',
  ShowProfile = 'SHOW_PROFILE',
  HideProfile = 'HIDE_PROFILE',
  ShowModal = 'SHOW_MODAL',
  ShowModalWithOptions = 'SHOW_MODAL_WITH_OPTIONS',
  ShowSideMenu = 'SHOW_SIDE_MENU',
  HideSideMenu = 'HIDE_SIDE_MENU',
  DeactivateAutoscroll = 'DEACTIVATE_AUTOSCROLL',
  ActivateAutoscroll = 'ACTIVATE_AUTOSCROLL',
  SetUseSimpleNames = 'SET_USE_SIMPLE_NAMES',
  SetKeepCameraWhenMoving = 'SET_KEEP_CAMERA_WHEN_MOVING',
  SetTextOnlyMode = 'SET_TEXT_ONLY_MODE',
  SetAudioOnlyMode = 'SET_AUDIO_ONLY_MODE',
  SetNumberOfFaces = 'SET_NUMBER_OF_FACES',
  SetCaptionsEnabled = 'SET_CAPTIONS_ENABLED',
  //
  SetUserId = 'SET_USER_ID',
  IsRegistered = 'IS_REGISTERED',
  BanToggle = 'BAN_TOGGLE',
  ModToggle = 'MOD_TOGGLE',
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
    roomData: { [roomId: string]: Room };
  };
}

export const UpdatedCurrentRoomAction = (
  roomId: string,
  roomData: { [roomId: string]: Room }
): UpdatedCurrentRoomAction => ({
  type: ActionType.UpdatedCurrentRoom,
  value: { roomId, roomData }
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
    roomData: { [roomId: string]: Room },
    presenceData?: { [roomId: string]: string[] },
    roomNotes?: RoomNote[]
  ): Thunk<Action, State> =>
    async (dispatch, getState) => {
      await getState().messageArchiveLoaded.promise
      dispatch(UpdatedCurrentRoomAction(roomId, roomData))
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
  value: { [roomId: string]: Room };
}

export const UpdatedRoomDataAction = (roomData: {
  [roomId: string]: Room;
}): UpdatedRoomDataAction => {
  return {
    type: ActionType.UpdatedRoomData,
    value: roomData
  }
}

interface UpdatedPresenceAction {
  type: ActionType.UpdatedPresence;
  value: { [roomId: string]: string[] };
}

export const UpdatedPresenceAction = (data: {
  [roomId: string]: string[];
}): UpdatedPresenceAction => {
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

interface CaptionMessageAction {
  type: ActionType.CaptionMessage;
  value: {
    messageId: string;
    name: string;
    message: string;
  };
}

export const CaptionMessageAction = (
  messageId: string,
  name: string,
  message: string
): CaptionMessageAction => {
  return {
    type: ActionType.CaptionMessage,
    value: { messageId, name, message }
  }
}

interface WhisperAction {
  type: ActionType.Whisper;
  value: {
    name: string;
    message: string;
  };
}

export const WhisperAction = (name: string, message: string): WhisperAction => {
  return {
    type: ActionType.Whisper,
    value: { name, message }
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

interface UserMapAction {
  type: ActionType.UserMap;
  value: { [userId: string]: MinimalUser };
}

export const UserMapAction = (map: {
  [userId: string]: MinimalUser;
}): UserMapAction => {
  return {
    type: ActionType.UserMap,
    value: map
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

interface UpdateProfileColorAction {
  type: ActionType.UpdateProfileColor;
  color: string;
}

export const UpdateProfileColorAction = (
  color: string
): UpdateProfileColorAction => {
  return {
    type: ActionType.UpdateProfileColor,
    color: color
  }
}

interface UpdateFontRewardAction {
  type: ActionType.UpdateFontReward;
  font: string;
}

export const UpdateFontRewardAction = (
  font: string
): UpdateFontRewardAction => {
  return {
    type: ActionType.UpdateFontReward,
    font: font
  }
}

interface MediaReceivedSpeakingDataAction {
  type: ActionType.MediaReceivedSpeakingData;
  value: string;
}

export const MediaReceivedSpeakingDataAction = (
  participantId: string
): MediaReceivedSpeakingDataAction => {
  return {
    type: ActionType.MediaReceivedSpeakingData,
    value: participantId
  }
}

interface StopVideoChatAction {
  type: ActionType.StopVideoChat;
}

export const StopVideoChatAction = (): StopVideoChatAction => {
  return { type: ActionType.StopVideoChat }
}

interface StartVideoChatAction {
  type: ActionType.StartVideoChat;
}

export const StartVideoChatAction = (): StartVideoChatAction => {
  return { type: ActionType.StartVideoChat }
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

// HACK ALERT: Used to force a re-render, but ideally the data relevant to the re-render should be tied to the action.
// Used right now because of timing issues in room presence between the client state and Twilio.
interface RefreshReactAction {
  type: ActionType.RefreshReact;
}

export const RefreshReactAction = (): RefreshReactAction => {
  return {
    type: ActionType.RefreshReact
  }
}

interface SendMessageAction {
  type: ActionType.SendMessage;
  value: string;
}

export const SendCaptionAction = (message: string): SendCaptionAction => {
  return {
    type: ActionType.SendCaption,
    value: message
  }
}
interface SendCaptionAction {
  type: ActionType.SendCaption;
  value: string;
}

export const SendMessageAction = (message: string): SendMessageAction => {
  return {
    type: ActionType.SendMessage,
    value: message
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

interface StartWhisperAction {
  type: ActionType.StartWhisper;
  value: string;
}

export const StartWhisperAction = (name: string): StartWhisperAction => {
  return { type: ActionType.StartWhisper, value: name }
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

interface SetKeepCameraWhenMovingAction {
  type: ActionType.SetKeepCameraWhenMoving;
  value: boolean;
}

export const SetKeepCameraWhenMovingAction = (
  keepCameraWhenMoving: boolean
): SetKeepCameraWhenMovingAction => {
  return {
    type: ActionType.SetKeepCameraWhenMoving,
    value: keepCameraWhenMoving
  }
}

interface SetTextOnlyModeAction {
  type: ActionType.SetTextOnlyMode;
  textOnlyMode: boolean;
  refresh: boolean;
}

export const SetTextOnlyModeAction = (
  textOnlyMode: boolean,
  refresh: boolean
): SetTextOnlyModeAction => {
  return {
    type: ActionType.SetTextOnlyMode,
    textOnlyMode: textOnlyMode,
    refresh: refresh
  }
}

interface SetAudioOnlyModeAction {
  type: ActionType.SetAudioOnlyMode;
  value: boolean;
}

export const SetAudioOnlyModeAction = (
  enable: boolean
): SetAudioOnlyModeAction => {
  return {
    type: ActionType.SetAudioOnlyMode,
    value: enable
  }
}
interface SetCaptionsEnabledAction {
  type: ActionType.SetCaptionsEnabled;
  value: boolean;
}

export const SetCaptionsEnabledAction = (
  enable: boolean
): SetCaptionsEnabledAction => {
  return {
    type: ActionType.SetCaptionsEnabled,
    value: enable
  }
}

interface SetNumberOfFacesAction {
  type: ActionType.SetNumberOfFaces;
  value: number;
}

export const SetNumberOfFacesAction = (num: number): SetNumberOfFacesAction => {
  return {
    type: ActionType.SetNumberOfFaces,
    value: num
  }
}

interface SetUserIdAction {
  type: ActionType.SetUserId;
  value: string;
}

export const SetUserIdAction = (
  userId: string,
): SetUserIdAction => {
  return {
    type: ActionType.SetUserId,
    value: userId
  }
}


interface IsRegisteredAction {
  type: ActionType.IsRegistered;
  value: string;
}

export const IsRegisteredAction = (username: string): IsRegisteredAction => {
  return { type: ActionType.IsRegistered, value: username }
}

interface BanToggleAction {
  type: ActionType.BanToggle;
  value: string;
}

export const BanToggleAction = (userId: string): BanToggleAction => {
  return { type: ActionType.BanToggle, value: userId }
}

interface ModToggleAction {
  type: ActionType.ModToggle;
  value: string;
}

export const ModToggleAction = (userId: string): ModToggleAction => {
  return { type: ActionType.ModToggle, value: userId }
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

      dispatch(LoadMessageArchiveActionStart(whispers))

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
  value: { badge: Badge; index: number };
}

export const EquipBadgeAction = (
  badge: Badge,
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
