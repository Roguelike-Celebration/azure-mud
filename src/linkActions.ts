import { pickUpRandomItemFromList, pickUpItem, sendChatMessage, displayMessageFromList, updateFontReward, displayMessage, orderNewDrink } from './networking'
import { v4 as uuidv4 } from 'uuid'

export const linkActions = {
  // ------------------------------------------- PICK UP ITEMS -------------------------------------------
  generateFood: () => {
    pickUpRandomItemFromList('vendingMachineFood')
  },
  popcorn: () => {
    pickUpRandomItemFromList('popcorn')
  },
  obeliskSouvenirs: () => {
    pickUpRandomItemFromList('obeliskSouvenirs')
  },
  deepFriedSnacks: () => {
    pickUpRandomItemFromList('deepFriedSnacks')
  },
  // ------------------------------------------- SEND CHAT MESSAGE SECTION -------------------------------------------
  // Ideally we would not have variable signatures in these functions.
  drinkPolymorph: (roomId: string) => { // Listen. Is this the correct way? No. Does it save me needing to write a new httpTrigger? Yes.
    sendChatMessage(uuidv4(), '/get colourful potion', roomId)
  },
  drinkCancellation: (roomId: string) => {
    sendChatMessage(uuidv4(), '/get clear potion', roomId)
  },

  // ------------------------------------------- DISPLAY MESSAGE SECTION -------------------------------------------
  readPoster: () => {
    displayMessageFromList('motivationPosters')
  },
  readClosedSign: () => {
    displayMessageFromList('closedSigns')
  },
  getGameRec: () => {
    displayMessageFromList('gameRecommendations')
  },
  hearTerribleJoke: () => {
    displayMessageFromList('terribleJokes')
  },
  watchRobot: () => {
    displayMessageFromList('robots')
  },
  tossARock: () => {
    displayMessageFromList('tossARock')
  },
  // ------------------------------------------- MISC ACTION SECTION -------------------------------------------
  pentagramHighTech: (roomId: string) => {
    pentagramAction('Impactful', roomId)
  },
  pentagramMinimalist: (roomId: string) => {
    pentagramAction('Classic', roomId)
  },
  pentagramComical: (roomId: string) => {
    pentagramAction('Comic', roomId)
  },
  pentagramNormal: (roomId: string) => {
    pentagramAction('', roomId)
  },
  orderNewDrink: () => {
    orderNewDrink()
  },
  spinAround: () => {
    spinTheRoom()
  }
}

const pentagramAction = function (font: string, roomId: string) {
  updateFontReward(uuidv4(), font)
  sendChatMessage(uuidv4(), '/go ASCII', roomId)
  displayMessage('You feel changed by your journey through the pentagram...')
}

const spinTheRoom = () => {
  document.querySelector('#main').classList.add('spin')
  setTimeout(() => {
    document.querySelector('#main').classList.remove('spin')
  }, 1600)
}
