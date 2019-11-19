type Register = 'a' | 'b' | 'c' | 'd'

type Registers = { [R in Register]: number }

interface Inc {
  kind: 'inc'
  x: Register
}

interface Dec {
  kind: 'dec'
  x: Register
}

interface Cpy {
  kind: 'cpy'
  x: number | Register
  y: Register
}

interface Jnz {
  kind: 'jnz'
  x: number | Register
  y: number | Register
}

interface Tgl {
  kind: 'tgl'
  x: Register
}

interface Empty {
  kind: 'empty'
}

type Instruction = Cpy | Inc | Dec | Jnz | Tgl | Empty

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

const getNumValue = (registers: Registers, arg: Register | number) => {
  return typeof arg === 'string' ? registers[arg] : arg
}

export function execute(
  instructions: Instruction[],
  initialRegisterValues: Registers = { a: 0, b: 0, c: 0, d: 0 },
  optimizationMode = false
) {
  instructions = instructions.slice()
  let registers = Object.assign({}, initialRegisterValues)
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
        if (getNumValue(registers, instruction.x))
          step = getNumValue(registers, instruction.y)
        break
      case 'cpy':
        const res = optimize(instruction, counter, instructions, registers)
        if (optimizationMode && res) {
          registers = { ...registers, ...res.registers }
          step = res.step
        } else {
          registers[instruction.y] = getNumValue(registers, instruction.x)
        }
        break
      case 'tgl':
        const offset = registers[instruction.x]
        const targetInstruction = instructions[counter + offset]
        if (targetInstruction) {
          instructions[counter + offset] = toggle(targetInstruction)
        }
        break
      case 'empty':
        break
    }
    counter += step
  }
  return registers
}

function toggle(instruction: Instruction): Instruction {
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

function optimize(
  instruction: Cpy,
  index: number,
  instructions: Instruction[],
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
      [counterRegister]: 0,
      [targetRegister]:
        getNumValue(registers, targetRegister) + getNumValue(registers, source)
    },
    step: 4
  }
}
