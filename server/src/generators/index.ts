import * as vendingMachineFood from './vendingMachineFood'
import * as fortuneCookies from './fortuneCookies'

interface Generator {
    generate(): string
    actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  vendingMachineFood,
  fortuneCookies
}

export default generators
