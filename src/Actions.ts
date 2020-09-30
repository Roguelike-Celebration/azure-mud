import { ThunkDispatch, useReducerWithThunk } from './useReducerWithThunk'
import { State } from './reducer'
import { fetchProfile } from './networking'
import { PublicUser, MinimalUser } from '../server/src/user'
import { Room } from './room'
import { Message, WhisperMessage } from './message'
import { RoomNote } from '../server/src/roomNote'
import { Modal } from './modals'
import { getMediaStream } from './webRTC'
import { ServerSettings } from '../server/src/types'

export type Action =
  | ReceivedMyProfileAction
  | ReceivedServerSettingsAction
  | UpdatedCurrentRoomAction
  | UpdatedRoomDataAction
  | UpdatedPresenceAction
  | UpdatedVideoPresenceAction
  | PlayerConnectedAction
  | PlayerDisconnectedAction
  | ChatMessageAction
  | ModMessageAction
  | DeleteMessageAction
  | LoadMessageArchiveAction
  | WhisperAction
  | ShoutAction
  | EmoteAction
  | PlayerEnteredAction
  | PlayerLeftAction
  | UserMapAction
  | PlayerBannedAction
  | PlayerUnbannedAction
  | UpdateProfileColorAction
  | P2PDataReceivedAction
  | P2PStreamReceivedAction
  | P2PConnectionClosedAction
  | P2PWaitingForConnectionsAction
  | LocalMediaStreamOpenedAction
  | LocalMediaDeviceListReceivedAction
  | MediaReceivedSpeakingDataAction
  | StopVideoChatAction
  | ErrorAction
  | SendMessageAction
  | SetNameAction
  | StartWhisperAction
  | ShowProfileAction
  | ShowModalAction
  | AuthenticateAction
  | IsRegisteredAction
  | BanToggleAction
  | ModToggleAction
  | NoteAddAction
  | NoteRemoveAction
  | NoteUpdateLikesAction
  | NoteUpdateRoomAction
  | HideModalAction
  | HideProfileAction
  | ShowSideMenuAction
  | HideSideMenuAction
  | DeactivateAutoscrollAction
  | ActivateAutoscrollAction
  | SpaceIsClosedAction
  | SpaceOpenedOrClosedAction

export enum ActionType {
  // Server-driven action
  ReceivedMyProfile = 'RECEIVED_MY_PROFILE',
  ReceivedServerSettings = 'RECEIVED_SERVER_SETTINGS',
  UpdatedCurrentRoom = 'UPDATED_CURRENT_ROOM',
  UpdatedRoomData = 'UPDATED_ROOM_DATA',
  UpdatedPresence = 'UPDATED_PRESENCE',
  UpdatedVideoPresence = 'UPDATED_VIDEO_PRESENCE',
  PlayerConnected = 'PLAYER_CONNECTED',
  PlayerDisconnected = 'PLAYER_DISCONNECTED',
  ChatMessage = 'CHAT_MESSAGE',
  ModMessage = 'MOD_MESSAGE',
  DeleteMessage = 'DELETE_MESSAGE',
  Whisper = 'WHISPER',
  Shout = 'SHOUT',
  Emote = 'EMOTE',
  PlayerEntered = 'PLAYER_ENTERED',
  PlayerLeft = 'PLAYER_LEFT',
  Error = 'ERROR',
  UserMap = 'USER_MAP',
  PlayerBanned = 'PLAYER_BANNED',
  PlayerUnbanned = 'PLAYER_UNBANNED',
  UpdateProfileColor = 'UPDATE_PROFILE_COLOR',
  // WebRTC
  P2PDataReceived = 'P2P_DATA_RECEIVED',
  P2PStreamReceived = 'P2P_STREAM_RECEIVED',
  P2PConnectionClosed = 'P2P_CONNECTION_CLOSED',
  P2PWaitingForConnections = 'P2P_WAITING_FOR_CONNECTIONS',
  LocalMediaStreamOpened = 'LOCAL_MEDIASTREAM_OPENED',
  StopVideoChat = 'STOP_VIDEO_CHAT',
  LocalMediaDeviceListReceived = 'LOCAL_MEDIA_DEVICE_LIST_RECEIVED',
  MediaReceivedSpeakingData = 'MEDIA_RECEIVED_SPEAKING_DATA',
  // UI actions
  SendMessage = 'SEND_MESSAGE',
  SetName = 'SET_NAME',
  StartWhisper = 'START_WHISPER',
  ShowProfile = 'SHOW_PROFILE',
  HideProfile = 'HIDE_PROFILE',
  ShowModal = 'SHOW_MODAL',
  ShowSideMenu = 'SHOW_SIDE_MENU',
  HideSideMenu = 'HIDE_SIDE_MENU',
  DeactivateAutoscroll = 'DEACTIVATE_AUTOSCROLL',
  ActivateAutoscroll = 'ACTIVATE_AUTOSCROLL',
  //
  Authenticate = 'AUTHENTICATE',
  IsRegistered = 'IS_REGISTERED',
  BanToggle = 'BAN_TOGGLE',
  ModToggle = 'MOD_TOGGLE',
  LoadMessageArchive = 'LOAD_MESSAGE_ARCHIVE',
  // Note Wall
  NoteAdd = 'NOTE_ADD',
  NoteRemove = 'NOTE_REMOVE',
  NoteUpdateLikes = 'NOTE_UPDATE_LIKES',
  NoteUpdateRoom = 'NOTE_UPDATE_ROOM',
  HideModalAction = 'HIDE_MODAL',

  SpaceIsClosed = 'SPACE_IS_CLOSED',
  SpaceOpenedOrClosed = 'SPACE_OPENED_OR_CLOSED'
}

interface ReceivedMyProfileAction {
  type: ActionType.ReceivedMyProfile;
  value: PublicUser;
}

export const ReceivedMyProfileAction = (
  user: PublicUser
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
  value: string;
}

export const UpdatedCurrentRoomAction = (
  roomId: string
): UpdatedCurrentRoomAction => {
  return {
    type: ActionType.UpdatedCurrentRoom,
    value: roomId
  }
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

interface UpdatedVideoPresenceAction {
  type: ActionType.UpdatedVideoPresence;
  value: {
    roomId: string,
    users: string[]
  }
}

export const UpdatedVideoPresenceAction = (roomId: string, users: string[]): UpdatedVideoPresenceAction => {
  return {
    type: ActionType.UpdatedVideoPresence,
    value: { roomId, users }
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
  }
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

export const ShoutAction = (messageId: string, name: string, message: string): ShoutAction => {
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
  }
}

export const EmoteAction = (messageId: string, name: string, message: string): EmoteAction => {
  return {
    type: ActionType.Emote,
    value: { messageId, name, message }
  }
}

interface PlayerEnteredAction {
  type: ActionType.PlayerEntered;
  value: {
    name: string;
    from: string;
  };
}

export const PlayerEnteredAction = (
  name: string,
  from: string
): PlayerEnteredAction => {
  return {
    type: ActionType.PlayerEntered,
    value: { name, from }
  }
}

interface PlayerLeftAction {
  type: ActionType.PlayerLeft;
  value: {
    name: string;
    to: string;
  };
}

export const PlayerLeftAction = (
  name: string,
  to: string
): PlayerLeftAction => {
  return {
    type: ActionType.PlayerLeft,
    value: { name, to }
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

export const PlayerUnbannedAction = (user: MinimalUser): PlayerUnbannedAction => {
  return {
    type: ActionType.PlayerUnbanned,
    value: user
  }
}

interface UpdateProfileColorAction {
  type: ActionType.UpdateProfileColor,
  color: string
}

export const UpdateProfileColorAction = (color: string): UpdateProfileColorAction => {
  return {
    type: ActionType.UpdateProfileColor,
    color: color
  }
}

interface P2PDataReceivedAction {
  type: ActionType.P2PDataReceived;
  value: {
    peerId: string;
    data: string;
  };
}

export const P2PDataReceivedAction = (
  peerId: string,
  data: string
): P2PDataReceivedAction => {
  return {
    type: ActionType.P2PDataReceived,
    value: { peerId, data }
  }
}

interface P2PStreamReceivedAction {
  type: ActionType.P2PStreamReceived;
  value: string;
}

export const P2PStreamReceivedAction = (
  peerId: string
): P2PStreamReceivedAction => {
  return {
    type: ActionType.P2PStreamReceived,
    value: peerId
  }
}

interface P2PConnectionClosedAction {
  type: ActionType.P2PConnectionClosed;
  value: string;
}

export const P2PConnectionClosedAction = (
  peerId: string
): P2PConnectionClosedAction => {
  return {
    type: ActionType.P2PConnectionClosed,
    value: peerId
  }
}

interface P2PWaitingForConnectionsAction {
  type: ActionType.P2PWaitingForConnections;
}

export const P2PWaitingForConnectionsAction = (): P2PWaitingForConnectionsAction => {
  return {
    type: ActionType.P2PWaitingForConnections
  }
}

export const PrepareToStartVideoChatAction = (): ((dispatch: ThunkDispatch<Action, State>) => void) => {
  // This loads a local webcam view
  // We show a "here's what you look like, select your input devices, toggle audio/video" before you connect
  // We need to grab a local feed first so we can get pretty names for the list of inputs.
  return async (dispatch: ThunkDispatch<Action, State>) => {
    // The act of fetching the local media stream triggers a local view of your webcam
    await getMediaStream(dispatch)
    const devices = await navigator.mediaDevices.enumerateDevices()
    dispatch(LocalMediaDeviceListReceivedAction(devices))
    dispatch(ShowModalAction(Modal.MediaSelector))
  }
}

interface LocalMediaStreamOpenedAction {
  type: ActionType.LocalMediaStreamOpened;
  value: {
    streamId: string;
    videoDeviceId: string;
    audioDeviceId: string;
  };
}

export const LocalMediaStreamOpenedAction = (
  streamId: string,
  devices: { videoDeviceId: string; audioDeviceId: string }
): LocalMediaStreamOpenedAction => {
  const { videoDeviceId, audioDeviceId } = devices
  return {
    type: ActionType.LocalMediaStreamOpened,
    value: { streamId, videoDeviceId, audioDeviceId }
  }
}

interface LocalMediaDeviceListReceivedAction {
  type: ActionType.LocalMediaDeviceListReceived;
  value: MediaDeviceInfo[];
}

export const LocalMediaDeviceListReceivedAction = (
  devices: MediaDeviceInfo[]
): LocalMediaDeviceListReceivedAction => {
  return {
    type: ActionType.LocalMediaDeviceListReceived,
    value: devices
  }
}

interface MediaReceivedSpeakingDataAction {
  type: ActionType.MediaReceivedSpeakingData;
  value: string[];
}

export const MediaReceivedSpeakingDataAction = (
  peerIds: string[]
): MediaReceivedSpeakingDataAction => {
  return {
    type: ActionType.MediaReceivedSpeakingData,
    value: peerIds
  }
}

interface StopVideoChatAction {
  type: ActionType.StopVideoChat;
}

export const StopVideoChatAction = (): StopVideoChatAction => {
  return { type: ActionType.StopVideoChat }
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

interface SendMessageAction {
  type: ActionType.SendMessage;
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

interface ShowProfileAction {
  type: ActionType.ShowProfile;
  value: PublicUser;
}

export const ShowProfileAction = (
  userId: string
): ((dispatch: ThunkDispatch<Action, State>) => void) => {
  return async (dispatch: ThunkDispatch<Action, State>) => {
    console.log('lol')
    const user = await fetchProfile(userId)
    if (!user) {
      console.log('No user')
      return
    }
    dispatch(ShowProfileActionForFetchedUser(user))
  }
}

interface HideProfileAction {
  type: ActionType.HideProfile;
}

export const HideProfileAction = (): HideProfileAction => {
  return { type: ActionType.HideProfile }
}

export const ShowProfileActionForFetchedUser = (
  user: PublicUser
): ShowProfileAction => {
  return {
    type: ActionType.ShowProfile,
    value: user
  }
}

interface ShowModalAction {
  type: ActionType.ShowModal;
  value: Modal
}

export const ShowModalAction = (modal: Modal): ShowModalAction => {
  return {
    type: ActionType.ShowModal,
    value: modal
  }
}

interface HideModalAction {
  type: ActionType.HideModalAction;
}

export const HideModalAction = (): HideModalAction => {
  return { type: ActionType.HideModalAction }
}

interface AuthenticateAction {
  type: ActionType.Authenticate;
  value: { name: string; userId: string, provider: string };
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

export const AuthenticateAction = (
  userId: string | undefined,
  name: string | undefined,
  provider: string | undefined
): AuthenticateAction => {
  return { type: ActionType.Authenticate, value: { userId, name, provider } }
}

interface IsRegisteredAction {
  type: ActionType.IsRegistered;
}

export const IsRegisteredAction = (): IsRegisteredAction => {
  return { type: ActionType.IsRegistered }
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

interface LoadMessageArchiveAction {
  type: ActionType.LoadMessageArchive;
  messages: Message[];
  whispers: WhisperMessage[];
}

export const LoadMessageArchiveAction = (messages: Message[], whispers: WhisperMessage[]): LoadMessageArchiveAction => {
  return { type: ActionType.LoadMessageArchive, messages: messages, whispers: whispers }
}

interface NoteAddAction {
  type: ActionType.NoteAdd;
  value: { roomId: string, note: RoomNote };
}

export const NoteAddAction = (roomId: string, note: RoomNote): NoteAddAction => {
  return { type: ActionType.NoteAdd, value: { roomId, note } }
}

interface NoteRemoveAction {
  type: ActionType.NoteRemove;
  value: { roomId: string, noteId: string };
}

export const NoteRemoveAction = (roomId: string, noteId: string): NoteRemoveAction => {
  return { type: ActionType.NoteRemove, value: { roomId, noteId } }
}

interface NoteUpdateLikesAction {
  type: ActionType.NoteUpdateLikes;
  value: { roomId: string, noteId: string, likes: string[] };
}

export const NoteUpdateLikesAction = (roomId: string, noteId: string, likes: string[]): NoteUpdateLikesAction => {
  return { type: ActionType.NoteUpdateLikes, value: { roomId, noteId, likes } }
}

interface NoteUpdateRoomAction {
  type: ActionType.NoteUpdateRoom;
  value: { roomId: string, notes: RoomNote[] };
}

export const NoteUpdateRoomAction = (roomId: string, notes: RoomNote[]): NoteUpdateRoomAction => {
  return { type: ActionType.NoteUpdateRoom, value: { roomId, notes } }
}

interface SpaceIsClosedAction {
  type: ActionType.SpaceIsClosed;
}

export const SpaceIsClosedAction = (): SpaceIsClosedAction => {
  return { type: ActionType.SpaceIsClosed }
}

interface SpaceOpenedOrClosedAction {
  type: ActionType.SpaceOpenedOrClosed;
  value: boolean
}

export const SpaceOpenedOrClosedAction = (value: boolean): SpaceOpenedOrClosedAction => {
  return { type: ActionType.SpaceOpenedOrClosed, value }
}
