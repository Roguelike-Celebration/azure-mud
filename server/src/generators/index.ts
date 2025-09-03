import * as madamChrysalia from './fortuneTellerNPC'
import * as dromadTam from './souvenirNPC'

interface Generator {
    generate(): string
    actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  madamChrysalia,
  dromadTam
}

export default generators
