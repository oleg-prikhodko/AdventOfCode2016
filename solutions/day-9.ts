import { equal } from 'assert'
import { readInputFile } from '../utils'

function getMarkerInfo(str: string) {
  const markerPattern = /\((?<len>\d+)x(?<repeat>\d+)\)/g
  const match = markerPattern.exec(str)
  if (!match) return null
  if (!match.groups) throw new Error('Incorrect input')
  const len = +match.groups.len
  const repeat = +match.groups.repeat
  const { index } = match
  const { lastIndex } = markerPattern
  return { len, repeat, index, lastIndex }
}

function decompress(str: string): string {
  const markerInfo = getMarkerInfo(str)
  if (!markerInfo) return str
  const { len, repeat, index, lastIndex } = markerInfo
  const before = str.slice(0, index)
  const decoded = str.slice(lastIndex, lastIndex + len).repeat(repeat)
  const after = str.slice(lastIndex + len)
  return before.concat(decoded, decompress(after))
}

function getLength(str: string): number {
  const markerInfo = getMarkerInfo(str)
  if (!markerInfo) return str.length
  const { len, repeat, index, lastIndex } = markerInfo
  const beforeLen = str.slice(0, index).length
  const decodedLen = getLength(str.slice(lastIndex, lastIndex + len))
  const afterLen = getLength(str.slice(lastIndex + len))
  return beforeLen + repeat * decodedLen + afterLen
}

equal(decompress('ADVENT'), 'ADVENT')
equal(decompress('A(1x5)BC'), 'ABBBBBC')
equal(decompress('(3x3)XYZ'), 'XYZXYZXYZ')
equal(decompress('A(2x2)BCD(2x2)EFG'), 'ABCBCDEFEFG')
equal(decompress('(6x1)(1x3)A'), '(1x3)A')
equal(decompress('X(8x2)(3x3)ABCY'), 'X(3x3)ABC(3x3)ABCY')

const input = readInputFile('day-9.txt')

console.log(`Part 1: ${decompress(input).length}`)

equal(getLength('(3x3)XYZ'), 9)
equal(getLength('X(8x2)(3x3)ABCY'), 20)
equal(getLength('(27x12)(20x12)(13x14)(7x10)(1x12)A'), 241920)
equal(
  getLength('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'),
  445
)

console.log(`Part 2: ${getLength(input)}`)
