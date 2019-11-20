export type Register = 'a' | 'b' | 'c' | 'd'

export type Registers = { [R in Register]: number }

interface Inc {
  kind: 'inc'
  x: Register
}

interface Dec {
  kind: 'dec'
  x: Register
}

export interface Cpy {
  kind: 'cpy'
  x: number | Register
  y: Register
}

interface Jnz {
  kind: 'jnz'
  x: number | Register
  y: number | Register
}

export type Instruction = Cpy | Inc | Dec | Jnz

function convertToNum(original: string) {
  const converted = +original
  return isNaN(converted) ? original : converted
}

const pattern = /(?<kind>\w+) (?<x>[-\w]+) *(?<y>[-\w]+)?/

export function getInstruction(line: string) {
  const { kind, x, y } = pattern.exec(line)!.groups!
  return {
    kind,
    x: convertToNum(x),
    ...(y && { y: convertToNum(y) })
  } as Instruction
}

export const getNumValue = (registers: Registers, arg: Register | number) => {
  return typeof arg === 'string' ? registers[arg] : arg
}

export function executeInstruction(
  instruction: Instruction,
  registers: Registers
): MachineState {
  const machineState = {
    registers: { ...registers },
    step: 1
  }
  switch (instruction.kind) {
    case 'inc':
      machineState.registers[instruction.x]++
      break
    case 'dec':
      machineState.registers[instruction.x]--
      break
    case 'jnz':
      if (getNumValue(registers, instruction.x))
        machineState.step = getNumValue(registers, instruction.y)
      break
    case 'cpy':
      machineState.registers[instruction.y] = getNumValue(
        registers,
        instruction.x
      )
      break
  }
  return machineState
}

interface MachineState {
  registers: Registers
  step: number
}

export function executeInstructions(
  instructions: Instruction[],
  initialRegisterValues: Registers = { a: 0, b: 0, c: 0, d: 0 }
): Registers {
  let machineState = {
    registers: { ...initialRegisterValues },
    step: 1
  }
  let counter = 0
  while (counter < instructions.length) {
    const instruction = instructions[counter]
    machineState.step = 1
    // update state
    machineState = executeInstruction(instruction, machineState.registers)
    //
    counter += machineState.step
  }
  return machineState.registers
}
