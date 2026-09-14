import * as polymorph from './polymorph'
import * as popcorn from './popcorn'
import * as deepFriedSnacks from './deepFriedSnacks'
import * as obeliskSouvenirs from './obeliskSouvenirs'

interface Generator {
  generate(): string
  actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  polymorph,
  popcorn,
  deepFriedSnacks,
  obeliskSouvenirs
}

export default generators
