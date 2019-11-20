import { readLines } from '../utils'
import {
  getInstruction,
  Instruction,
  Register,
  Registers,
  getNumValue,
  Cpy,
  executeInstruction
} from '../assembunny'
import { equal } from 'assert'

interface Tgl {
  kind: 'tgl'
  x: Register
}

interface Empty {
  kind: 'empty'
}

type ExtendedInstruction = Instruction | Tgl | Empty

function optimize(
  instruction: Cpy,
  index: number,
  instructions: ExtendedInstruction[],
  registers: Registers
) {
  const source = instruction.x
  const counterRegister = instruction.y

  const [a, b, c] = instructions.slice(index + 1, index + 4)
  if (!a || !b || !c) return

  if (c.kind !== 'jnz' || c.y !== -2 || c.x !== counterRegister) return

  const targetRegister = (() => {
    if (a.kind === 'inc' && b.kind === 'dec' && b.x === c.x) {
      return a.x
    } else if (a.kind === 'dec' && b.kind === 'inc' && a.x === c.x) {
      return b.x
    }
  })()
  if (!targetRegister) return

  const [d, e] = instructions.slice(index + 4, index + 6)
  if (
    d &&
    e &&
    d.kind === 'dec' &&
    e.kind === 'jnz' &&
    e.y === -5 &&
    d.x === e.x
  ) {
    return {
      registers: {
        ...registers,
        [counterRegister]: 0,
        [d.x]: 0,
        [targetRegister]:
          getNumValue(registers, targetRegister) +
          getNumValue(registers, source) * getNumValue(registers, d.x)
      },
      step: 6
    }
  }

  return {
    registers: {
      ...registers,
      [counterRegister]: 0,
      [targetRegister]:
        getNumValue(registers, targetRegister) + getNumValue(registers, source)
    },
    step: 4
  }
}

function toggle(instruction: ExtendedInstruction): ExtendedInstruction {
  switch (instruction.kind) {
    case 'inc':
      return { kind: 'dec', x: instruction.x }
    case 'dec':
      return { kind: 'inc', x: instruction.x }
    case 'tgl':
      return { kind: 'inc', x: instruction.x }
    case 'cpy':
      return { kind: 'jnz', x: instruction.x, y: instruction.y }
    case 'jnz':
      if (typeof instruction.y === 'number') {
        return { kind: 'empty' }
      } else {
        return { kind: 'cpy', x: instruction.x, y: instruction.y }
      }
    case 'empty':
      return instruction
  }
}

function executeInstructions(
  instructions: ExtendedInstruction[],
  initialRegisterValues: Registers = { a: 0, b: 0, c: 0, d: 0 }
): Registers {
  let machineState = {
    registers: { ...initialRegisterValues },
    step: 1
  }
  let counter = 0
  instructions = instructions.slice()
  while (counter < instructions.length) {
    const instruction = instructions[counter]
    machineState.step = 1
    // run
    switch (instruction.kind) {
      case 'empty':
        break
      case 'tgl':
        const offset = machineState.registers[instruction.x]
        const targetInstruction = instructions[counter + offset]
        if (targetInstruction) {
          instructions[counter + offset] = toggle(targetInstruction)
        }
        break
      case 'cpy':
        const res = optimize(
          instruction,
          counter,
          instructions,
          machineState.registers
        )
        machineState =
          res || executeInstruction(instruction, machineState.registers)
        break
      default:
        machineState = executeInstruction(instruction, machineState.registers)
        break
    }
    //
    counter += machineState.step
  }
  return machineState.registers
}

const testInstructions: ExtendedInstruction[] = [
  'cpy 2 a',
  'tgl a',
  'tgl a',
  'tgl a',
  'cpy 1 a',
  'dec a',
  'dec a'
].map(getInstruction)

equal(executeInstructions(testInstructions).a, 3)

const instructions = readLines('day-23.txt').map(getInstruction)

console.log(
  'Part 1:',
  executeInstructions(instructions, { a: 7, b: 0, c: 0, d: 0 }).a
)
console.log(
  'Part 2:',
  executeInstructions(instructions, { a: 12, b: 0, c: 0, d: 0 }).a
)
