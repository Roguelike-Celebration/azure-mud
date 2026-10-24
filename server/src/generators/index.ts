import * as artifacts from './artifacts.js'
import * as balls from './balls.js'
import * as boba from './boba.js'
import * as rules from './calvinBallRules.js'
import * as hotDog from './nathansHotDogs.js'
import * as popcorn from './orvillePopcorn.js'
import * as polymorph from './polymorph.js'
import * as transcendenceItems from './transcendenceItems.js'

interface Generator {
  generate(): string
  actionString(item: string): string
}

const generators: { [name: string]: Generator } = {
  polymorph,
  popcorn,
  hotDog,
  balls,
  artifacts,
  boba,
  rules,
  transcendenceItems
}

export default generators
