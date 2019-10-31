import { readInputFile, range } from '../utils'

type Direction = 'up' | 'down' | 'left' | 'right'
type Turn = 'L' | 'R'
type PosChange = ['y' | 'x', number]

interface Coordinates {
  x: number
  y: number
}

interface State {
  dir: Direction
  pos: Coordinates
}

function getNewDirection(direction: Direction, turn: Turn): Direction {
  switch (direction) {
    case 'up':
      return turn === 'L' ? 'left' : 'right'
    case 'down':
      return turn === 'L' ? 'right' : 'left'
    case 'left':
      return turn === 'L' ? 'down' : 'up'
    case 'right':
      return turn === 'L' ? 'up' : 'down'
  }
}

function getMovementInfo(str: string) {
  const match = /^(?<turn>[RL]){1}(?<units>\d+)$/.exec(str)
  if (
    match &&
    match.groups &&
    'turn' in match.groups &&
    'units' in match.groups
  ) {
    const turn = match.groups.turn as Turn
    const units = +match.groups.units
    return { turn, units }
  } else {
    throw new Error('Incorrect input')
  }
}

function getPositionChange(dir: Direction, units: number): PosChange {
  switch (dir) {
    case 'up':
      return ['y', units]
    case 'down':
      return ['y', -units]
    case 'left':
      return ['x', -units]
    case 'right':
      return ['x', units]
  }
}

function* getPoints(pos: Coordinates, [coord, units]: PosChange) {
  if (coord === 'x') {
    for (const val of range(pos.x, pos.x + units)) yield { x: val, y: pos.y }
  } else {
    for (const val of range(pos.y, pos.y + units)) yield { x: pos.x, y: val }
  }
}

const state: State = {
  dir: 'up',
  pos: {
    x: 0,
    y: 0
  }
}

let locationHistory = [state.pos]

readInputFile('day-1.txt')
  .split(', ')
  .forEach(movement => {
    const { turn, units } = getMovementInfo(movement)
    state.dir = getNewDirection(state.dir, turn)
    const change = getPositionChange(state.dir, units)
    const [, ...points] = [...getPoints(state.pos, change)]
    locationHistory = locationHistory.concat(points)
    state.pos = points[points.length - 1]
  })

const visitedLocations = new Set()
const visitedTwiceFirst = locationHistory.find(pos => {
  const repr = JSON.stringify(pos)
  if (visitedLocations.has(repr)) {
    return true
  } else {
    visitedLocations.add(repr)
    return false
  }
})

console.log(`Part 1: ${JSON.stringify(state.pos)}`)
console.log(`Part 2: ${JSON.stringify(visitedTwiceFirst)}`)
