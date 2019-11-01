import { readInputFile } from '../utils'

interface Cpy {
  kind: 'cpy'
  x: number | string
  y: string
}

interface Inc {
  kind: 'inc'
  x: string
}

interface Dec {
  kind: 'dec'
  x: string
}

interface Jnz {
  kind: 'jnz'
  x: number | string
  y: number
}

type Instruction = Cpy | Inc | Dec | Jnz

function convertToNum(original: string) {
  const converted = +original
  return isNaN(converted) ? original : converted
}

const pattern = /(?<kind>\w+) (?<x>\w+) *(?<y>[-\w]+)?/
const instructions = readInputFile('day-12.txt')
  .split('\n')
  .map(line => {
    const { kind, x, y } = pattern.exec(line)!.groups!
    return {
      kind,
      x: convertToNum(x),
      ...(y && { y: convertToNum(y) })
    } as Instruction
  })

function execute(initialRegisterValues: [string, number][]) {
  const registers = new Map(initialRegisterValues)

  const getNumValue = (arg: string | number) => {
    return typeof arg === 'string' ? registers.get(arg)! : arg
  }

  let counter = 0
  while (counter < instructions.length) {
    const instruction = instructions[counter]
    let step = 1
    switch (instruction.kind) {
      case 'inc':
        registers.set(instruction.x, registers.get(instruction.x)! + 1)
        break
      case 'dec':
        registers.set(instruction.x, registers.get(instruction.x)! - 1)
        break
      case 'jnz':
        const valueToCheck = getNumValue(instruction.x)
        if (valueToCheck) step = instruction.y
        break
      case 'cpy':
        const valueToCopy = getNumValue(instruction.x)
        registers.set(instruction.y, valueToCopy)
        break
    }
    counter += step
  }
  return registers
}

const registersPart1 = execute([['a', 0], ['b', 0], ['c', 0], ['d', 0]])
console.log(`Part 1: ${registersPart1.get('a')}`)

const registersPart2 = execute([['a', 0], ['b', 0], ['c', 1], ['d', 0]])
console.log(`Part 2: ${registersPart2.get('a')}`)
