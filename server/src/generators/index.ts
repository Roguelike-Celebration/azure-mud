import * as vendingMachineFood from './vendingMachineFood'

interface Generator {
    generate(): string
    actionString(item: string): string
}

const generators: {[name: string]: Generator} = {
  vendingMachineFood
}

export default generators
