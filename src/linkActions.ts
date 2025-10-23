import { pickUpRandomItemFromList, pickUpItem, sendChatMessage, displayMessageFromList, updateFontReward, displayMessage, orderNewDrink } from './networking'
import { v4 as uuidv4 } from 'uuid'

export const linkActions = {
  //-------------------------------------------PICK UP ITEMS-------------------------------------------
  generateFood: () => {
    pickUpRandomItemFromList('vendingMachineFood')
  },
  playCraneGame: () => {
    pickUpRandomItemFromList('craneGame')
  },
  pickUpPuppy: () => {
    pickUpItem('a tiny puppy')
  },
  readCatalog: () => {
    pickUpRandomItemFromList('seersCatalog')
  },
  boba: () => {
    pickUpRandomItemFromList('boba')
  },
  veganFood: () => {
    pickUpRandomItemFromList('veganFood')
  },
  tacos: () => {
    pickUpRandomItemFromList('tacos')
  },
  kebabs: () => {
    pickUpRandomItemFromList('kebabs')
  },
  generateBalloon: () => {
    pickUpRandomItemFromList('balloonAnimals')
  },
  snowCone: () => {
    pickUpRandomItemFromList('snowCone')
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
  //-------------------------------------------SEND CHAT MESSAGE SECTION-------------------------------------------
  // Ideally we would not have variable signatures in these functions.
  drinkPolymorph: (roomId: string) => { // Listen. Is this the correct way? No. Does it save me needing to write a new httpTrigger? Yes.
    sendChatMessage(uuidv4(), '/get colourful potion', roomId)
  },
  drinkCancellation: (roomId: string) => {
    sendChatMessage(uuidv4(), '/get clear potion', roomId)
  },
  getFortune: (roomId: string) => {
    sendChatMessage(uuidv4(), '/get fortune cookie', roomId)
  },

  //-------------------------------------------DISPLAY MESSAGE SECTION-------------------------------------------
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
  talkToUbizara: () => {
    displayMessageFromList('ubizaraTheBartender')
  },
  talkToDrHope: () => {
    displayMessageFromList('doctorHope')
  },
  talkToChadSilverbow: () => {
    displayMessageFromList('chadSilverbow')
  },
  talkToZeroCrash: () => {
    displayMessageFromList('zeroCrash')
  },
  talkToRandorTheTwisted: () => {
    displayMessageFromList('randorTheTwisted')
  },
  talkToFlower: () => {
    displayMessageFromList('flower')
  },
  talkToBodyWorksCharacter: () => {
    displayMessageFromList('bodyWorksCharacter')
  },
  talkToHotDogGuy: () => {
    displayMessageFromList('hotDogGuy')
  },
  talkToRay: () => {
    displayMessageFromList('ray')
  },
  talkToLoudRobert: () => {
    displayMessageFromList('loudRobert')
  },
  tossARock: () => {
    displayMessageFromList('tossARock')
  },
  talkToZara: () => {
    displayMessageFromList('zara')
  },
  dromadTam: () => {
    displayMessageFromList('dromadTam')
  },
  madamChrysalia: () => {
    displayMessageFromList('madamChrysalia')
  },
  tarotPull: () => {
    displayMessageFromList('tarotPull')
  },
  mimeKing: () => {
    displayMessageFromList('mimeKing')
  },
  barathrumites: () => {
    displayMessageFromList('barathrumites')
  },
  //-------------------------------------------MISC ACTION SECTION-------------------------------------------
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
