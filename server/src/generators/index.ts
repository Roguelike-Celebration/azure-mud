import * as madamChrysalia from './fortuneTellerNPC'
import * as dromadTam from './souvenirNPC'
import * as polymorph from './polymorph'

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
