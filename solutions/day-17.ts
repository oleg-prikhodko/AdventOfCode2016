import { Queue, md5 } from '../utils'

type CoordinatePair = [number, number]
interface Room {
  coordinates: CoordinatePair
  path: string
}

function isOpen(char: string) {
  const chars = new Set(['b', 'c', 'd', 'e', 'f'])
  return chars.has(char)
}

function isValidPos(pos: CoordinatePair) {
  return pos.every(coord => coord >= 0 && coord <= 3)
}

function isVaultRoom(room: Room) {
  const [x, y] = room.coordinates
  return x === 3 && y === 3
}

function getAdjacent({ coordinates, path }: Room, passcode = 'mmsxrhfx') {
  return md5(passcode + path)
    .slice(0, 4)
    .split('')
    .map((char, idx): {
      coordinates: CoordinatePair
      path: string
      open: boolean
    } => {
      const [x, y] = coordinates
      const open = isOpen(char)
      switch (idx) {
        case 0:
          return { coordinates: [x, y - 1], path: path + 'U', open }
        case 1:
          return { coordinates: [x, y + 1], path: path + 'D', open }
        case 2:
          return { coordinates: [x - 1, y], path: path + 'L', open }
        case 3:
          return { coordinates: [x + 1, y], path: path + 'R', open }
        default:
          throw new Error('Incorrect index')
      }
    })
    .filter(({ coordinates, open }) => open && isValidPos(coordinates))
    .map(({ coordinates, path }) => ({ coordinates, path }))
}

function findSolutions() {
  const startRoom: Room = { coordinates: [0, 0], path: '' }
  const rooms = new Queue([startRoom])
  const addRoom = rooms.add.bind(rooms)
  const solutions: string[] = []

  while (true) {
    const room = rooms.remove()
    if (!room) break
    if (isVaultRoom(room)) {
      solutions.push(room.path)
      continue
    }
    getAdjacent(room).forEach(addRoom)
  }

  return solutions
}

const solutions = findSolutions()
const shortest = solutions[0]
const longest = solutions[solutions.length - 1]

console.log('Part 1:', shortest)
console.log('Part 2:', longest.length)
