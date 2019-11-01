import { readInputFile } from '../utils'

type Register = 'a' | 'b' | 'c' | 'd'

type Registers = { [R in Register]: number }

interface Cpy {
  kind: 'cpy'
  x: number | Register
  y: Register
}

interface Inc {
  kind: 'inc'
  x: Register
}

interface Dec {
  kind: 'dec'
  x: Register
}

interface Jnz {
  kind: 'jnz'
  x: number | Register
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

function execute(initialRegisterValues: Registers) {
  const registers = Object.assign({}, initialRegisterValues)

  const getNumValue = (arg: Register | number) => {
    return typeof arg === 'string' ? registers[arg] : arg
  }

  let counter = 0
  while (counter < instructions.length) {
    const instruction = instructions[counter]
    let step = 1
    switch (instruction.kind) {
      case 'inc':
        registers[instruction.x]++
        break
      case 'dec':
        registers[instruction.x]--
        break
      case 'jnz':
        if (getNumValue(instruction.x)) step = instruction.y
        break
      case 'cpy':
        registers[instruction.y] = getNumValue(instruction.x)
        break
    }
    counter += step
  }
  return registers
}

const registersPart1 = execute({ a: 0, b: 0, c: 0, d: 0 })
console.log(`Part 1: ${registersPart1.a}`)

const registersPart2 = execute({ a: 0, b: 0, c: 1, d: 0 })
console.log(`Part 2: ${registersPart2.a}`)
