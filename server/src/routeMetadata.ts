import sendMagicEmail from "./endpoints/sendMagicEmail"

export interface EndpointOptions {
  authenticated?: boolean
  mod?: boolean
  audit?: boolean
}

type EndpointOrMethodSplitEndpoint = EndpointOptions | { [key in "get"|"post"|"put"|"delete"]?: EndpointOptions }



const routes: {[key: string]: EndpointOrMethodSplitEndpoint} = {
  addRoomNote: { authenticated: true, audit: true },
  banUser: { authenticated: true, mod: true, audit: true },
  clientDeployedWebhook: { },
  connect: { authenticated: true, audit: true },
  deleteMessage: { authenticated: true, mod: true, audit: true },
  deleteRoom: { authenticated: true, mod: true},
  deleteRoomNote: { authenticated: true, audit: true },
  disconnect: { authenticated: true, audit: true },
  displayMessage: { authenticated: true },
  equipBadge: { authenticated: true, audit: true },
  fetchProfile: {  },
  getAllRooms: { authenticated: true, mod: true }, // Doesn't NEED to be mod-only, but is currently only used by the room editor
  getRoom: { authenticated: true, mod: true }, // Doesn't NEED to be mod-only, but is currently only used by the room editor
  getRoomIds: { authenticated: true, mod: true }, // Doesn't NEED to be mod-only, but is currently only used by the room editor
  heartbeat: { },
  isRegistered: {},
  leaveVideoChat: { authenticated: true },
  likeRoomNote: { authenticated: true },
  moveRoom: { authenticated: true },
  // negotiate: {}, // TODO: Not wrapped / simple
  // negotiatePubSub: {}, //TODO: Not wrapped / simple
  openOrCloseSpace: { authenticated: true, audit: true, mod: true },
  orderNewDrink: { authenticated: true, audit: true },
  pickUpItem: { authenticated: true },
  pong: { authenticated: true },
  resetBadgeData: { authenticated: true, mod: true },
  resetRoomData: { authenticated: true, mod: true },
  sendCaption: { authenticated: true, audit: true },
  sendChatMessage: { authenticated: true, audit: true },
  sendMagicEmail: { audit: true },
  serverSettings: { 
    get: {}, 
    post: { authenticated: true, mod: true } 
  },
  toggleModStatus: { authenticated: true, audit: true, mod: true },
  toggleSpeakerStatus: { authenticated: true, audit: true, mod: true },
  // twilioToken: {}, // TODO: Not wrapped, also not needed
  updateFontReward: { authenticated: true, audit: true },
  updateProfile: {  }, // TODO: This does custom audit log work that isn't reflected in a non-azure path
  updateProfileColor: { authenticated: true, audit: true },
  updateRoom: { authenticated: true, mod: true },
}

export default routes;