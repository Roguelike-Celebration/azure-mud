import { pickUpRandomItemFromList, pickUpItem } from './networking'

export const linkActions = {
  generateFood: () => {
    pickUpRandomItemFromList('vendingMachineFood')
  },
  pickUpPuppy: () => {
    pickUpItem('a tiny puppy')
  }
}
