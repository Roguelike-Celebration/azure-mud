import { pickUpRandomItemFromList, pickUpItem, sendChatMessage, displayMessageFromList, updateFontReward, displayMessage, orderNewDrink } from './networking'
import { v4 as uuidv4 } from 'uuid'

export const linkActions = {
  generateFood: () => {
    pickUpRandomItemFromList('vendingMachineFood')
  },
  generateBalloon: () => {
    pickUpRandomItemFromList('balloonAnimals')
  },
  playCraneGame: () => {
    pickUpRandomItemFromList('craneGame')
  },
  pickUpPuppy: () => {
    pickUpItem('a tiny puppy')
  },
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
  readPoster: () => {
    displayMessageFromList('motivationPosters')
  },
  readClosedSign: () => {
    displayMessageFromList('closedSigns')
  },
  getGameRec: () => {
    displayMessageFromList('gameRecommendations')
  },
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
  dromadTam: () => {
    displayMessageFromList('dromadTam')
  },
  madamChrysalia: () => {
    displayMessageFromList('madamChrysalia')
  },
  orderNewDrink: () => {
    orderNewDrink()
  },
  spinAround: () => {
    spinTheRoom()
  },
  talkToBodyWorksCharacter: () => {
    displayMessageFromList('bodyWorksCharacter')
  },
  readCatalog: () => {
    pickUpRandomItemFromList('seersCatalog')
  },
  talkToZara: () => {
    displayMessageFromList('zara')
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
