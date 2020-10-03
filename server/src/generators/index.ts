import * as vendingMachineFood from './vendingMachineFood'
import * as fortuneCookies from './fortuneCookies'
import * as polymorph from './polymorph'

interface Generator {
    generate(): string
    actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  vendingMachineFood,
  fortuneCookies,
  polymorph
}

export default generators
