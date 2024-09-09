import addRoomNote from "./src/endpoints/addRoomNote"
import banUser from "./src/endpoints/banUser"
import clientDeployedWebhook from "./src/endpoints/clientDeployedWebhook"
import deleteMessage from "./src/endpoints/deleteMessage"
import deleteRoom from "./src/endpoints/deleteRoom"
import deleteRoomNote from "./src/endpoints/deleteRoomNote"
import disconnect from "./src/endpoints/disconnect"
import displayMessage from "./src/endpoints/displayMessage"
import fetchProfile from "./src/endpoints/fetchProfile"
import isRegistered from "./src/endpoints/isRegistered"
import leaveVideoChat from "./src/endpoints/leaveVideoChat"
import likeRoomNote from "./src/endpoints/likeRoomNote"
import moveRoom from "./src/endpoints/moveRoom"
import getAllRooms from "./src/endpoints/getAllRooms"
import getRoom from "./src/endpoints/getRoom"
import getRoomIds from "./src/endpoints/getRoomIds"
import connect from "./src/endpoints/connect"
import equipBadge from "./src/endpoints/equipBadge"
import openOrCloseSpace from "./src/endpoints/openOrCloseSpace"
import orderNewDrink from "./src/endpoints/orderNewDrink"
import pickUpItem from "./src/endpoints/pickUpItem"
import pong from "./src/endpoints/pong"
import resetBadgeData from "./src/endpoints/resetBadgeData"
import resetRoomData from "./src/endpoints/resetRoomData"
import sendCaption from "./src/endpoints/sendCaption"
import sendChatMessage from "./src/endpoints/sendChatMessage"
import toggleModStatus from "./src/endpoints/toggleModStatus"
import toggleSpeakerStatus from "./src/endpoints/toggleSpeakerStatus"
import updateFontReward from "./src/endpoints/updateFontReward"
import updateProfile from "./src/endpoints/updateProfile"
import updateProfileColor from "./src/endpoints/updateProfileColor"
import updateRoom from "./src/endpoints/updateRoom"
import heartbeat from "./src/endpoints/heartbeat"
import { getServerSettings, postServerSettings } from "./src/endpoints/serverSettings"

// This verb list is obviously incomplete and may need augmenting
type FunctionOrMethodSplitFunction = Function | { [key in "GET"|"POST"|"PUT"|"DELETE"]?: Function }


const routes: {[key: string]: FunctionOrMethodSplitFunction} = {
  addRoomNote,
  banUser,
  clientDeployedWebhook,
  connect,
  deleteMessage,
  deleteRoom,
  deleteRoomNote,
  disconnect,
  displayMessage,
  equipBadge,
  fetchProfile,
  getAllRooms,
  getRoom,
  getRoomIds,
  heartbeat,
  isRegistered,
  leaveVideoChat,
  likeRoomNote,
  moveRoom,
  loser: () => {},
  // negotiate: {}, // TODO: Will need to be different locally
  // negotiatePubSub: {}, //TODO: Will need to be different locally
  openOrCloseSpace,
  orderNewDrink,
  pickUpItem,
  pong,
  resetBadgeData,
  resetRoomData,
  sendCaption,
  sendChatMessage,
  serverSettings: {
    GET: getServerSettings,
    POST: postServerSettings
  },
  toggleModStatus,
  toggleSpeakerStatus,
  // twilioToken: {}, // TODO: Not wrapped, also not needed
  updateFontReward,
  updateProfile, // TODO: Does custom audit log work. Confirm it can't use normal authentication (I think because it is called before a user exists)
  updateProfileColor,
  updateRoom,
}

export default routes;