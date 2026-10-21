import * as artifacts from './artifacts'
import * as balls from './balls'
import * as boba from './boba'
import * as rules from './calvinBallRules'
import * as hotDog from './nathansHotDogs'
import * as popcorn from './orvillePopcorn'
import * as polymorph from './polymorph'
import * as transcendenceItems from './transcendenceItems'

interface Generator {
  generate(): string
  actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
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
