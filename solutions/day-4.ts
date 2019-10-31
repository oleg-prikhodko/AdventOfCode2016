import { readInputFile, countLetters } from '../utils'

interface Room {
  name: string
  checksum: string
  sectorId: number
}

function readData(line: string): Room {
  const match = /([a-z\-]+)-(\d+)\[(\w+)\]/.exec(line)
  if (!match) throw new Error('Incorrect input')
  const [, name, sectorId, checksum] = match
  return { name, sectorId: +sectorId, checksum }
}

function genChecksum(letterCounts: [string, number][]) {
  return letterCounts.map(([letter]) => letter).join('')
}

function isRealRoom({ name, checksum }: Room) {
  return checksum === genChecksum(countLetters(name.replace(/-/g, ''), 5))
}

const rooms = readInputFile('day-4.txt')
  .split('\n')
  .map(readData)

const realRooms = rooms.filter(isRealRoom)
const sectorSum = realRooms.reduce((acc, { sectorId }) => acc + sectorId, 0)

console.log(`Part 1: ${sectorSum}`)

function rotateChar(char: string, times: number) {
  const startCodePoint = 'a'.charCodeAt(0)
  const letterIndex = char.charCodeAt(0) - startCodePoint
  return String.fromCharCode(((letterIndex + times) % 26) + startCodePoint)
}

function rotate(str: string, times: number) {
  return str
    .split('')
    .map(char => rotateChar(char, times))
    .join('')
}

function decrypt({ name, sectorId, checksum }: Room): Room {
  const decryptedName = name
    .split('-')
    .map(str => rotate(str, sectorId))
    .join(' ')
  return { name: decryptedName, sectorId, checksum }
}

const secretRoom = realRooms
  .map(decrypt)
  .find(({ name }) => /north/i.test(name))

if (!secretRoom) throw new Error('Room not found')

console.log(`Part 2: ${secretRoom.sectorId}`)
