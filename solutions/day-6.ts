import { readInputFile, mostCommon, leastCommon } from '../utils'

const messageLength = 8
const cols: string[][] = []

readInputFile('day-6.txt')
  .replace(/\n/g, '')
  .split('')
  .forEach((char, index) => {
    const col = index % messageLength
    if (!cols[col]) cols[col] = [char]
    else cols[col].push(char)
  })

function letterReducer(transform: (str: string) => string) {
  return (acc: string, col: string[]) => acc + transform(col.join(''))
}

const word1 = cols.reduce(letterReducer(mostCommon), '')
console.log(`Part 1: ${word1}`)

const word2 = cols.reduce(letterReducer(leastCommon), '')
console.log(`Part 2: ${word2}`)
