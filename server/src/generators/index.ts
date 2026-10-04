import * as polymorph from './polymorph'
import * as popcorn from './popcorn'
import * as obeliskSouvenirs from './obeliskSouvenirs'

interface Generator {
  generate(): string
  actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  polymorph,
  popcorn,
  obeliskSouvenirs
}

export default generators
