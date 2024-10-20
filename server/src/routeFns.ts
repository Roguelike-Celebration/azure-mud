import addRoomNote from './endpoints/roomNote/addRoomNote'
import banUser from './endpoints/banUser'
import clientDeployedWebhook from './endpoints/clientDeployedWebhook'
import deleteMessage from './endpoints/deleteMessage'
import deleteRoom from './endpoints/deleteRoom'
import deleteRoomNote from './endpoints/roomNote/deleteRoomNote'
import disconnect from './endpoints/disconnect'
import displayMessage from './endpoints/displayMessage'
import fetchProfile from './endpoints/fetchProfile'
import isRegistered from './endpoints/isRegistered'
import leaveVideoChat from './endpoints/leaveVideoChat'
import likeRoomNote from './endpoints/roomNote/likeRoomNote'

import moveRoom from './endpoints/moveRoom'
import getAllRooms from './endpoints/getAllRooms'
import getRoom from './endpoints/getRoom'
import getRoomIds from './endpoints/getRoomIds'
import connect from './endpoints/connect'
import equipBadge from './endpoints/equipBadge'
import openOrCloseSpace from './endpoints/openOrCloseSpace'
import orderNewDrink from './endpoints/orderNewDrink'
import pickUpItem from './endpoints/pickUpItem'
import pong from './endpoints/pong'
import resetBadgeData from './endpoints/resetBadgeData'
import resetRoomData from './endpoints/resetRoomData'
import sendCaption from './endpoints/sendCaption'
import sendChatMessage from './endpoints/sendChatMessage'
import toggleModStatus from './endpoints/toggleModStatus'
import toggleSpeakerStatus from './endpoints/toggleSpeakerStatus'
import updateFontReward from './endpoints/updateFontReward'
import updateProfile from './endpoints/updateProfile'
import updateProfileColor from './endpoints/updateProfileColor'
import updateRoom from './endpoints/updateRoom'
import heartbeat from './endpoints/heartbeat'
import { getServerSettings, postServerSettings } from './endpoints/serverSettings'
import sendMagicEmail from './endpoints/sendMagicEmail'
import likeObeliskNote from './endpoints/obelisk/likeObeliskNote'
import addObeliskNote from './endpoints/obelisk/addObeliskNote'
import deleteObeliskNote from './endpoints/obelisk/deleteObeliskNote'
import startObservingObelisk from './endpoints/obelisk/startObservingObelisk'
import stopObservingObelisk from './endpoints/obelisk/stopObservingObelisk'

// This verb list is obviously incomplete and may need augmenting
type FunctionOrMethodSplitFunction = Function | { [key in 'get'|'post']?: Function }

const routes: {[key: string]: FunctionOrMethodSplitFunction} = {
  addRoomNote, // get or post
  addObeliskNote,
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
  deleteObeliskNote,
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
  likeObeliskNote,
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
  startObservingObelisk,
  stopObservingObelisk,
  toggleModStatus,
  toggleSpeakerStatus,
  // twilioToken: {}, // TODO: Not wrapped, also not needed
  updateFontReward,
  updateProfile, // TODO: Does custom audit log work. Confirm it can't use normal authentication (I think because it is called before a user exists)
  updateProfileColor,
  updateRoom
}

export default routes
