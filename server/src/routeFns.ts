import addRoomNote from "./endpoints/addRoomNote"
import banUser from "./endpoints/banUser"
import clientDeployedWebhook from "./endpoints/clientDeployedWebhook"
import deleteMessage from "./endpoints/deleteMessage"
import deleteRoom from "./endpoints/deleteRoom"
import deleteRoomNote from "./endpoints/deleteRoomNote"
import disconnect from "./endpoints/disconnect"
import displayMessage from "./endpoints/displayMessage"
import fetchProfile from "./endpoints/fetchProfile"
import isRegistered from "./endpoints/isRegistered"
import leaveVideoChat from "./endpoints/leaveVideoChat"
import likeRoomNote from "./endpoints/likeRoomNote"
import moveRoom from "./endpoints/moveRoom"
import getAllRooms from "./endpoints/getAllRooms"
import getRoom from "./endpoints/getRoom"
import getRoomIds from "./endpoints/getRoomIds"
import connect from "./endpoints/connect"
import equipBadge from "./endpoints/equipBadge"
import openOrCloseSpace from "./endpoints/openOrCloseSpace"
import orderNewDrink from "./endpoints/orderNewDrink"
import pickUpItem from "./endpoints/pickUpItem"
import pong from "./endpoints/pong"
import resetBadgeData from "./endpoints/resetBadgeData"
import resetRoomData from "./endpoints/resetRoomData"
import sendCaption from "./endpoints/sendCaption"
import sendChatMessage from "./endpoints/sendChatMessage"
import toggleModStatus from "./endpoints/toggleModStatus"
import toggleSpeakerStatus from "./endpoints/toggleSpeakerStatus"
import updateFontReward from "./endpoints/updateFontReward"
import updateProfile from "./endpoints/updateProfile"
import updateProfileColor from "./endpoints/updateProfileColor"
import updateRoom from "./endpoints/updateRoom"
import heartbeat from "./endpoints/heartbeat"
import { getServerSettings, postServerSettings } from "./endpoints/serverSettings"
import sendMagicEmail from "./endpoints/sendMagicEmail"

// This verb list is obviously incomplete and may need augmenting
type FunctionOrMethodSplitFunction = Function | { [key in "get"|"post"]?: Function }


const routes: {[key: string]: FunctionOrMethodSplitFunction} = {
  addRoomNote, // get or post
  banUser, // get or post
  clientDeployedWebhook: {
    post: clientDeployedWebhook
  },
  connect, // get or post
  deleteMessage: { // lol this should be delete
    post: deleteMessage
  },
  deleteRoom,
  deleteRoomNote,
  disconnect,
  displayMessage,
  equipBadge,
  fetchProfile,
  getAllRooms,
  getRoom,
  getRoomIds,
  heartbeat, // this is a cronjob!!
  isRegistered,
  leaveVideoChat,
  likeRoomNote,
  moveRoom,
  loser: () => {},
  // negotiate: {}, // TODO: Will need to be different locally. is POST
  // negotiatePubSub: {}, //TODO: Will need to be different locally
  openOrCloseSpace,
  orderNewDrink,
  pickUpItem,
  pong,
  resetBadgeData,
  resetRoomData,
  sendCaption,
  sendChatMessage,
  sendMagicEmail,
  serverSettings: {
    get: getServerSettings,
    post: postServerSettings
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