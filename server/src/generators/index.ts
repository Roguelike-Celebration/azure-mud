import * as vendingMachineFood from './vendingMachineFood'
import * as fortuneCookies from './fortuneCookies'
import * as polymorph from './polymorph'
import * as motivationPosters from './motivationPosters'
import * as closedSigns from './closedSigns'
import * as gameRecommendations from './gameRecs'
import * as robots from './robots'
import * as pickupLines from './pickupLines'
import * as ubizaraTheBartender from './ubizaraTheBartender'

interface Generator {
    generate(): string
    actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  vendingMachineFood,
  fortuneCookies,
  polymorph,
  motivationPosters,
  closedSigns,
  gameRecommendations,
  robots,
  pickupLines,
  ubizaraTheBartender,
  doctorHope,
  chadSilverbow
}

export default generators
