import { readInputFile } from '../utils'
import { getInstruction, execute } from '../assembunny'
import { equal } from 'assert'

const testInstructions = [
  'cpy 2 a',
  'tgl a',
  'tgl a',
  'tgl a',
  'cpy 1 a',
  'dec a',
  'dec a'
].map(getInstruction)

equal(execute(testInstructions).a, 3)

const instructions = readInputFile('day-23.txt')
  .split('\n')
  .map(getInstruction)

console.log('Part 1:', execute(instructions, { a: 7, b: 0, c: 0, d: 0 }).a)
console.log(
  'Part 2:',
  execute(instructions, { a: 12, b: 0, c: 0, d: 0 }, true).a
)
