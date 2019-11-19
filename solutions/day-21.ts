import { equal } from 'assert'
import { readLines, range } from '../utils'

interface TwoPositions {
  posX: number
  posY: number
}
interface SwapPositions extends TwoPositions {
  kind: 'swapPositions'
}
interface SwapLetters {
  kind: 'swapLetters'
  letterA: string
  letterB: string
}
interface Reverse extends TwoPositions {
  kind: 'reverse'
}
interface Rotate {
  kind: 'rotate'
  direction: 'left' | 'right'
  steps: number
}
interface Move extends TwoPositions {
  kind: 'move'
}
interface RotatePosition {
  kind: 'rotatePosition'
  letter: string
}
type Instruction =
  | SwapPositions
  | SwapLetters
  | Reverse
  | Rotate
  | Move
  | RotatePosition

function getInstruction(line: string): Instruction {
  if (/swap position/.test(line)) {
    const [, posX, posY] = /(\d) with position (\d)/.exec(line)!
    return {
      kind: 'swapPositions',
      posX: +posX,
      posY: +posY
    } as SwapPositions
  } else if (/swap letter/.test(line)) {
    const [, letterA, letterB] = /(\w) with letter (\w)/.exec(line)!
    return { kind: 'swapLetters', letterA, letterB } as SwapLetters
  } else if (/rotate (left|right)/.test(line)) {
    const [, direction, steps] = /(left|right) (\d) step/.exec(line)!
    return { kind: 'rotate', direction, steps: +steps } as Rotate
  } else if (/rotate based on/.test(line)) {
    const [, letter] = /letter (\w)/.exec(line)!
    return { kind: 'rotatePosition', letter } as RotatePosition
  } else if (/reverse/.test(line)) {
    const [, posX, posY] = /(\d) through (\d)/.exec(line)!
    return { kind: 'reverse', posX: +posX, posY: +posY } as Reverse
  } else {
    const [, posX, posY] = /(\d) to position (\d)/.exec(line)!
    return { kind: 'move', posX: +posX, posY: +posY } as Move
  }
}

function swapPositions(str: string, posX: number, posY: number) {
  const [minPos, maxPos] = posX < posY ? [posX, posY] : [posY, posX]
  return (
    str.slice(0, minPos) +
    str[maxPos] +
    str.slice(minPos + 1, maxPos) +
    str[minPos] +
    str.slice(maxPos + 1)
  )
}

function swapLetters(str: string, letterA: string, letterB: string) {
  return str
    .replace(new RegExp(letterA, 'g'), '_')
    .replace(new RegExp(letterB, 'g'), letterA)
    .replace(new RegExp('_', 'g'), letterB)
}

function rotate(str: string, steps: number) {
  const len = str.length
  const shift = steps % len
  if (shift === 0) {
    return str
  } else {
    return str.slice(-shift) + str.slice(0, -shift)
  }
}

function rotateBasedOn(str: string, letter: string) {
  const match = new RegExp(letter).exec(str)
  if (!match) {
    return str
  } else {
    return rotate(str, match.index + (match.index >= 4 ? 2 : 1))
  }
}

function reverse(str: string, posX: number, posY: number) {
  const reversed = str
    .slice(posX, posY + 1)
    .split('')
    .reverse()
    .join('')
  return str.slice(0, posX) + reversed + str.slice(posY + 1)
}

function move(str: string, posX: number, posY: number) {
  const letter = str[posX]
  const temp = str.slice(0, posX) + str.slice(posX + 1)
  return temp.slice(0, posY) + letter + temp.slice(posY)
}

function unrotateBasedOn(str: string, letter: string) {
  const match = new RegExp(letter).exec(str)
  if (!match) return str

  for (const steps of range(-1, -Infinity)) {
    const candidate = rotate(str, steps)
    if (str === rotateBasedOn(candidate, letter)) return candidate
  }
}

function doInstruction(pass: string, instruction: Instruction) {
  switch (instruction.kind) {
    case 'swapPositions':
      return swapPositions(pass, instruction.posX, instruction.posY)
    case 'swapLetters':
      return swapLetters(pass, instruction.letterA, instruction.letterB)
    case 'rotate':
      return instruction.direction === 'right'
        ? rotate(pass, instruction.steps)
        : rotate(pass, -instruction.steps)
    case 'rotatePosition':
      return rotateBasedOn(pass, instruction.letter)
    case 'reverse':
      return reverse(pass, instruction.posX, instruction.posY)
    case 'move':
      return move(pass, instruction.posX, instruction.posY)
  }
}

function undoInstruction(pass: string, instruction: Instruction) {
  switch (instruction.kind) {
    case 'rotate':
      return instruction.direction === 'right'
        ? rotate(pass, -instruction.steps)
        : rotate(pass, +instruction.steps)
    case 'rotatePosition':
      return unrotateBasedOn(pass, instruction.letter)!
    case 'move':
      return move(pass, instruction.posY, instruction.posX)
    default:
      return doInstruction(pass, instruction)
  }
}

function scramble(instructions: Instruction[], initialPass: string) {
  return instructions.reduce(doInstruction, initialPass)
}

function unscramble(instructions: Instruction[], initialPass: string) {
  return instructions
    .slice()
    .reverse()
    .reduce(undoInstruction, initialPass)
}

const testInstructions = [
  'swap position 4 with position 0',
  'swap letter d with letter b',
  'reverse positions 0 through 4',
  'rotate left 1 step',
  'move position 1 to position 4',
  'move position 3 to position 0',
  'rotate based on position of letter b',
  'rotate based on position of letter d'
].map(getInstruction)
const testPass = 'abcde'
const testResult = 'decab'

equal(scramble(testInstructions, testPass), testResult)
equal(unscramble(testInstructions, testResult), testPass)

const instructions = readLines('day-21.txt').map(getInstruction)
console.log('Part 1:', scramble(instructions, 'abcdefgh'))
console.log('Part 2:', unscramble(instructions, 'fbgdceah'))
