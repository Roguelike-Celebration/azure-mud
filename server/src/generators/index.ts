import * as polymorph from './polymorph'
import * as popcorn from './orvillePopcorn'
import * as hotDog from './nathansHotDogs'
import * as balls from './balls'
import * as artifacts from './artifacts'
import * as boba from './boba'
import * as rules from './calvinBallRules'

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
  rules
}

export default generators
