import { readLines } from '../utils'
import {
  getInstruction,
  Instruction,
  Register,
  getNumValue,
  Registers,
  executeInstruction
} from '../assembunny'

const instructions: ExtendedInstruction[] = readLines('day-25.txt').map(
  getInstruction
)

interface Out {
  kind: 'out'
  x: Register | number
}

type ExtendedInstruction = Instruction | Out

function* executeExtendedInstructions(
  instructions: ExtendedInstruction[],
  initialRegisterValues: Registers = { a: 0, b: 0, c: 0, d: 0 }
): Generator<number> {
  let machineState = {
    registers: { ...initialRegisterValues },
    step: 1
  }
  let counter = 0
  while (counter < instructions.length) {
    const instruction = instructions[counter]
    machineState.step = 1
    // run
    switch (instruction.kind) {
      case 'out':
        yield getNumValue(machineState.registers, instruction.x)
        break
      default:
        machineState = executeInstruction(instruction, machineState.registers)
        break
    }
    //
    counter += machineState.step
  }
}

function take<T>(limit: number, seq: Generator<T>) {
  let counter = 0
  const res: T[] = []
  while (counter < limit) {
    res.push(seq.next().value)
    counter++
  }
  return res
}

function findRegVal() {
  let a = 0
  while (true) {
    const registers = { a, b: 0, c: 0, d: 0 }
    const firstElements = take(
      30,
      executeExtendedInstructions(instructions, registers)
    )
    if (/^(01){15}$/.test(firstElements.join(''))) return a
    a++
  }
}

console.log('Part 1:', findRegVal())
