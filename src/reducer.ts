import { Action, ActionType } from "./Actions";
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
  createModMessage,
  createMovedRoomMessage,
} from "./message";
import { Room } from "./room";
import {
  sendChatMessage,
  toggleUserBan,
  setNetworkMediaChatStatus,
} from "./networking";
import { PublicUser, MinimalUser } from "../server/src/user";
import { disconnectAllPeers } from "./webRTC";

export interface State {
  authenticated: boolean;
  checkedAuthentication: boolean;

  hasRegistered: boolean;

  roomId?: string;
  userId?: string;
  userMap: { [userId: string]: MinimalUser };
  roomData: { [roomId: string]: Room };
  profileData?: PublicUser;

  messages: Message[];

  prepopulatedInput?: string;

  localMediaStreamId?: string;
  otherMediaStreamPeerIds?: string[];

  inMediaChat: boolean;
  mediaDevices?: MediaDeviceInfo[];
  currentVideoDeviceId?: string;
  currentAudioDeviceId?: string;
  speakingPeerIds?: string[];

  // Right now, the profile edit screen is the only time (other than onboarding)
  // that we actively show a different modal screen replacing the chat view.
  //
  // If that assumption changes, yell at Em if she hasn't refactored this away.
  showProfileEditScreen?: boolean;

  // User ID of whose profile should be shwon
  visibleProfile?: PublicUser;
}

export const defaultState: State = {
  authenticated: false,
  checkedAuthentication: false,
  hasRegistered: false,
  messages: [],
  userMap: {},
  roomData: {},
  inMediaChat: false,
  speakingPeerIds: [],
};

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  console.log("In reducer", action);

  // TODO: This could hurt perf when we have a lot of messages
  let state: State = JSON.parse(JSON.stringify(oldState));
  state.prepopulatedInput = undefined;

  if (action.type === ActionType.ReceivedMyProfile) {
    state.profileData = action.value;
  }

  if (action.type === ActionType.UpdatedCurrentRoom) {
    state.roomId = action.value;

    // Add a local "you have moved to X room" message
    if (state.roomData && state.roomData[action.value]) {
      const room = state.roomData[action.value];
      state.messages.push(createMovedRoomMessage(room.shortName));
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
    (action as Action).type = ActionType.StopVideoChat;
  }

  if (action.type === ActionType.UpdatedRoomData) {
    state.roomData = { ...state.roomData, ...action.value };
  }

  if (action.type === ActionType.UpdatedPresence) {
    Object.keys(action.value).forEach((roomId) => {
      if (state.roomData[roomId]) {
        state.roomData[roomId].users = action.value[roomId];
      }
    });
  }

  if (action.type === ActionType.PlayerConnected) {
    const user = action.value;
    if (!state.roomData[state.roomId].users.includes(user.id)) {
      state.roomData[state.roomId].users.push(user.id);
      state.messages.push(createConnectedMessage(user.id));
    }
    state.userMap[user.id] = user;
  }

  if (action.type === ActionType.PlayerDisconnected) {
    state.roomData[state.roomId].users = state.roomData[
      state.roomId
    ].users.filter((u) => u !== action.value);
    state.messages.push(createDisconnectedMessage(action.value));
  }

  if (action.type === ActionType.PlayerEntered) {
    if (!state.roomData[state.roomId].users.includes(action.value.name)) {
      state.roomData[state.roomId].users.push(action.value.name);
      state.messages.push(
        createEnteredMessage(action.value.name, action.value.from)
      );
    }
  }

  if (action.type === ActionType.PlayerLeft) {
    state.roomData[state.roomId].users = state.roomData[
      state.roomId
    ].users.filter((u) => u !== action.value.name);
    state.messages.push(createLeftMessage(action.value.name, action.value.to));
  }

  if (action.type === ActionType.ChatMessage) {
    state.messages.push(
      createChatMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.Whisper) {
    state.messages.push(
      createWhisperMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.ModMessage) {
    state.messages.push(
      createModMessage(
        action.value.name,
        action.value.message,
        action.value.name === state.userId
      )
    );
  }

  if (action.type === ActionType.Shout) {
    state.messages.push(
      createShoutMessage(action.value.name, action.value.message)
    );
  }

  if (action.type == ActionType.Emote) {
    state.messages.push(
      createEmoteMessage(action.value.name, action.value.message)
    )
  }

  if (action.type === ActionType.UserMap) {
    state.userMap = { ...state.userMap, ...action.value };
  }

  if (action.type === ActionType.Error) {
    state.messages.push(createErrorMessage(action.value));
  }

  // WebRTC
  if (action.type === ActionType.LocalMediaStreamOpened) {
    state.localMediaStreamId = action.value.streamId;
    state.currentAudioDeviceId = action.value.audioDeviceId;
    state.currentVideoDeviceId = action.value.videoDeviceId;
  }

  if (action.type === ActionType.P2PStreamReceived) {
    if (!state.otherMediaStreamPeerIds) {
      state.otherMediaStreamPeerIds = [];
    }

    if (!state.otherMediaStreamPeerIds.includes(action.value)) {
      state.otherMediaStreamPeerIds.push(action.value);
    }
  }

  if (action.type === ActionType.P2PDataReceived) {
    console.log("Received P2P data!", action.value.peerId, action.value.data);
  }

  if (action.type === ActionType.P2PConnectionClosed) {
    state.otherMediaStreamPeerIds = state.otherMediaStreamPeerIds.filter(
      (p) => p !== action.value
    );
  }

  if (action.type === ActionType.P2PWaitingForConnections) {
    state.inMediaChat = true;
    delete state.mediaDevices;
  }

  if (action.type === ActionType.LocalMediaDeviceListReceived) {
    state.mediaDevices = action.value;
  }

  if (action.type === ActionType.MediaReceivedSpeakingData) {
    state.speakingPeerIds = action.value;
  }

  if (action.type === ActionType.StopVideoChat) {
    setNetworkMediaChatStatus(false);
    disconnectAllPeers();
    delete state.localMediaStreamId;
    delete state.otherMediaStreamPeerIds;
    state.inMediaChat = false;
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    sendChatMessage(action.value);

    const isCommand = /^\/(.+?) (.+)/.exec(action.value);
    if (isCommand) {
      if (isCommand[1] === "whisper") {
        const [_, username, message] = /^(.+?) (.+)/.exec(isCommand[2]);
        const user = Object.values(state.userMap).find(
          (u) => u.username === username
        );
        const userId = user && user.id;
        if (userId) {
          state.messages.push(createWhisperMessage(userId, message, true));
        }
      }
    } else {
      state.messages.push(createChatMessage(state.userId, action.value));
    }
  }

  if (action.type === ActionType.StartWhisper) {
    state.prepopulatedInput = `/whisper ${action.value} `;
  }

  if (action.type === ActionType.ShowProfile) {
    state.visibleProfile = action.value;
  }

  if (action.type === ActionType.ShowEditProfile) {
    state.showProfileEditScreen = true;
  }

  if (action.type === ActionType.Authenticate) {
    state.checkedAuthentication = true;

    if (action.value.userId && action.value.name) {
      state.authenticated = true;
      state.userId = action.value.userId;

      // If you haven't registered yet, we need to grab your username before we've pulled a server userMap
      state.userMap[action.value.userId] = {
        id: action.value.userId,
        username: action.value.name,
      };
    }
  }

  if (action.type === ActionType.IsRegistered) {
    state.hasRegistered = true;
  }

  if (action.type === ActionType.BanToggle) {
    toggleUserBan(action.value);
  }

  return state;
};
