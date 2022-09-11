import { pickUpRandomItemFromList, pickUpItem, sendChatMessage, displayMessageFromList, updateFontReward, displayMessage, orderNewDrink } from './networking'
import { v4 as uuidv4 } from 'uuid'

export const linkActions = {
  generateFood: () => {
    pickUpRandomItemFromList('vendingMachineFood')
  },
  pickUpPuppy: () => {
    pickUpItem('a tiny puppy')
  },
  drinkPolymorph: () => { // Listen. Is this the correct way? No. Does it save me needing to write a new httpTrigger? Yes.
    sendChatMessage(uuidv4(), '/get colourful potion')
  },
  drinkCancellation: () => {
    sendChatMessage(uuidv4(), '/get clear potion')
  },
  getFortune: () => {
    sendChatMessage(uuidv4(), '/get fortune cookie')
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
  pentagramHighTech: () => {
    pentagramAction('Impactful')
  },
  pentagramMinimalist: () => {
    pentagramAction('Classic')
  },
  pentagramComical: () => {
    pentagramAction('Comic')
  },
  pentagramNormal: () => {
    pentagramAction('')
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
  orderNewDrink: () => {
    orderNewDrink()
  }
}

const pentagramAction = function (font: string) {
  updateFontReward(uuidv4(), font)
  sendChatMessage(uuidv4(), '/go ASCII')
  displayMessage('You feel changed by your journey through the pentagram...')
}
