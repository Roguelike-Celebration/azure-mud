import * as madamChrysalia from './fortuneTellerNPC'
import * as dromadTam from './souvenirNPC'
import * as polymorph from './polymorph'
import * as balloonAnimals from './balloonAnimals'
import * as popcorn from './popcorn'
import * as snowCone from './snowCone'
import * as deepFriedSnacks from './deepFriedSnacks'
import * as obeliskSouvenirs from './obeliskSouvenirs'
import * as barathrumites from './barathrumites'
import * as mimeKing from './mimeKing'
import * as tarotPull from './tarotPull'

interface Generator {
  generate(): string
  actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  madamChrysalia,
  dromadTam,
  polymorph,
  balloonAnimals,
  popcorn,
  snowCone,
  deepFriedSnacks,
  obeliskSouvenirs,
  barathrumites,
  mimeKing,
  tarotPull
}

export default generators
