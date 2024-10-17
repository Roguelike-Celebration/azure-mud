import * as vendingMachineFood from './vendingMachineFood'
import * as fortuneCookies from './fortuneCookies'
import * as polymorph from './polymorph'
import * as motivationPosters from './motivationPosters'
import * as closedSigns from './closedSigns'
import * as gameRecommendations from './gameRecs'
import * as robots from './robots'
import * as terribleJokes from './terribleJokes'
import * as ubizaraTheBartender from './ubizaraTheBartender'
import * as doctorHope from './doctorHope'
import * as chadSilverbow from './chadSilverbow'
import * as zeroCrash from './zeroCrash'
import * as randorTheTwisted from './randorTheTwisted'
import * as flower from './flower'
import * as drinkSkeletons from './drinkSkeletons'
import * as drinkVessels from './drinkVessels'
import * as drinkContents from './drinkContents'
import * as drinkNames from './drinkNames'
// begin 2023
import * as craneGame from './craneGame'
import * as bodyWorksCharacter from './bodyWorksCharacter'
import * as seersCatalog from './seersCatalog'
import * as zara from './zara'
import * as hotDogGuy from './hotDogGuy'
import * as ray from './ray'
import * as loudRobert from './loudRobert'
import * as tossARock from './chasm'
import * as boba from './boba'
import * as tacos from './tacos'
import * as kebabs from './kebabs'
import * as veganFood from './veganFood'

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
  terribleJokes,
  ubizaraTheBartender,
  doctorHope,
  chadSilverbow,
  zeroCrash,
  randorTheTwisted,
  flower,
  drinkSkeletons,
  drinkVessels,
  drinkContents,
  drinkNames,
  craneGame,
  bodyWorksCharacter,
  seersCatalog,
  zara,
  hotDogGuy,
  ray,
  loudRobert,
  tossARock,
  boba,
  tacos,
  kebabs,
  veganFood
}

export default generators
