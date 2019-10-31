import { readInputFile, getRowCol, getIndex, range } from '../utils'

type Movement = 'U' | 'D' | 'L' | 'R'

function getNewIndex(buttonIndex: number, movement: Movement, side: number) {
  const [row, col] = getRowCol(buttonIndex, side)
  switch (movement) {
    case 'U':
      return row - 1 < 0 ? buttonIndex : getIndex(row - 1, col, side)
    case 'D':
      return row + 1 >= side ? buttonIndex : getIndex(row + 1, col, side)
    case 'L':
      return col - 1 < 0 ? buttonIndex : getIndex(row, col - 1, side)
    case 'R':
      return col + 1 >= side ? buttonIndex : getIndex(row, col + 1, side)
  }
}

const instructions = readInputFile('day-2.txt').split('\n')

type GetNewIndex = (index: number, movement: Movement, side: number) => number

function getCode(
  side: number,
  startIndex: number,
  getIndex: GetNewIndex,
  buttons: string[]
) {
  let currentIndex = startIndex
  let code = ''
  instructions.forEach(movements => {
    movements.split('').forEach(movement => {
      currentIndex = getIndex(currentIndex, movement as Movement, side)
    })
    code += buttons[currentIndex]
  })
  return code
}

const side_1 = 3
const startIndex_1 = 4
const buttons_1 = Array.from(range(1, side_1 ** 2)).map(num => num.toString())
console.log(`Part 1: ${getCode(side_1, startIndex_1, getNewIndex, buttons_1)}`)

// --------------- part 2 --------------- //

const includedIndexes = Array.from(range(0, 5 ** 2 - 1)).filter(el => {
  const [row, col] = getRowCol(el, 5)
  return (
    (row > 0 && col > 0 && row < 4 && col < 4) || (row % 5 == 2 || col % 5 == 2)
  )
})

const buttonNames = Array.from(range(1, 13)).map(num =>
  num.toString(16).toUpperCase()
)
const buttons_2: string[] = Array(25).fill('-')
buttons_2.forEach((_, index) => {
  if (includedIndexes.includes(index)) {
    const first = buttonNames.shift()
    if (first) buttons_2[index] = first
  }
})

function getNewIndexDiamond(index: number, movement: Movement, side: number) {
  const newIndex = getNewIndex(index, movement, side)
  return includedIndexes.includes(newIndex) ? newIndex : index
}

const side_2 = 5
const startIndex_2 = 10
console.log(
  `Part 2: ${getCode(side_2, startIndex_2, getNewIndexDiamond, buttons_2)}`
)
