import * as vendingMachineFood from './vendingMachineFood'
import * as fortuneCookies from './fortuneCookies'
import * as polymorph from './polymorph'
import * as motivationPosters from './motivationPosters'
import * as closedSigns from './closedSigns'
import * as gameRecommendations from './gameRecs'
import * as robots from './robots'
import * as pickupLines from './pickupLines'
import * as ubizaraTheBartender from './ubizaraTheBartender'
import * as doctorHope from './doctorHope'
import * as chadSilverbow from './chadSilverbow'
import * as drinkSkeletons from './drinkSkeletons'
import * as drinkVessels from './drinkVessels'
import * as drinkContents from './drinkContents'
import * as drinkNames from './drinkNames'

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
  chadSilverbow,
  drinkSkeletons,
  drinkVessels,
  drinkContents,
  drinkNames
}

export default generators
