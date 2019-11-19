import { readLines } from '../utils'
import { getInstruction, execute } from '../assembunny'

const instructions = readLines('day-12.txt').map(getInstruction)

const registersPart1 = execute(instructions)
console.log(`Part 1: ${registersPart1.a}`)

const registersPart2 = execute(instructions, { a: 0, b: 0, c: 1, d: 0 })
console.log(`Part 2: ${registersPart2.a}`)
