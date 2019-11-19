import { readLines, getRowCol, getIndex, make2d } from '../utils'

interface RectCommand {
  type: 'rect'
  width: number
  height: number
}

interface RotateCommand {
  type: 'rotate'
  axis: string
  index: number
  units: number
}

type Command = RectCommand | RotateCommand

const rectPattern = /^(?<type>rect) (?<width>\w+)x(?<height>\w+)$/
const rotatePattern = /^(?<type>rotate) \w+ (?<axis>x|y)=(?<index>\d+) by (?<units>\d+)$/

const getCommand = (line: string) => {
  const match = /rect/.test(line)
    ? rectPattern.exec(line)
    : rotatePattern.exec(line)

  if (!match || !match.groups) throw new Error('Incorrect input')
  const { type, width, height, axis, index, units } = match.groups

  switch (type) {
    case 'rect':
      return { type, width: +width, height: +height }
    case 'rotate':
      return { type, axis, index: +index, units: +units }
    default:
      throw new Error('Incorrect input')
  }
}

const commands: Command[] = readLines('day-8.txt').map(getCommand)

const screenWidth = 50
const screenHeight = 6
const screen: number[] = Array(screenWidth * screenHeight).fill(0)

function drawRect(screen: number[], width: number, height: number) {
  return screen.map((pix, index) => {
    const [row, col] = getRowCol(index, screenWidth)
    return row < height && col < width ? 1 : pix
  })
}

function rotate(
  screen: number[],
  axis: string,
  axisIndex: number,
  units: number
) {
  const newScreen = screen.slice()
  screen.forEach((pix, index) => {
    const [row, col] = getRowCol(index, screenWidth)
    if (axis === 'x' && col === axisIndex) {
      const newRow = (row + units) % screenHeight
      const newIndex = getIndex(newRow, col, screenWidth)
      newScreen[newIndex] = pix
    } else if (axis === 'y' && row === axisIndex) {
      const newCol = (col + units) % screenWidth
      const newIndex = getIndex(row, newCol, screenWidth)
      newScreen[newIndex] = pix
    }
  })
  return newScreen
}

let s = screen

commands.forEach(command => {
  switch (command.type) {
    case 'rect':
      s = drawRect(s, command.width, command.height)
      break
    case 'rotate':
      s = rotate(s, command.axis, command.index, command.units)
      break
  }
})

const pixelsLit = s.reduce((acc, pix) => acc + pix)
console.log(`Part 1: ${pixelsLit}`)
console.log('Part 2:')
// pretty print to be readable
console.table(
  make2d(
    s.map(n => (n === 1 ? '0' : null)),
    screenWidth
  )
)
