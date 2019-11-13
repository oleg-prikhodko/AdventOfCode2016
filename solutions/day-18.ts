import { readInputFile, getRowCol, getIndex } from '../utils'

const SAFE = 0
const TRAP = 1

const firstRow = readInputFile('day-18.txt')
  .split('')
  .map(char => (char === '^' ? TRAP : SAFE))
const rowLength = firstRow.length

function isTrap(val: number) {
  return val === TRAP
}

function getType(tiles: Uint8Array, index: number) {
  const [row, col] = getRowCol(index, rowLength)
  const left =
    col - 1 >= 0 ? tiles[getIndex(row - 1, col - 1, rowLength)] : SAFE
  const center = tiles[getIndex(row - 1, col, rowLength)]
  const right =
    col + 1 < rowLength ? tiles[getIndex(row - 1, col + 1, rowLength)] : SAFE
  return [
    isTrap(left) && isTrap(center) && !isTrap(right),
    !isTrap(left) && isTrap(center) && isTrap(right),
    isTrap(left) && !isTrap(center) && !isTrap(right),
    !isTrap(left) && !isTrap(center) && isTrap(right)
  ].some(Boolean)
    ? TRAP
    : SAFE
}

function buildRows(tiles: Uint8Array, rowCount: number) {
  const start = rowLength
  let index = start
  while (index < start + rowCount * rowLength) {
    tiles[index] = getType(tiles, index)
    index++
  }
}

function calcSafeTilesCount(rowCount: number) {
  const tiles = new Uint8Array(rowCount * rowLength)
  tiles.set(firstRow)
  buildRows(tiles, rowCount - 1)
  return tiles.filter(tile => !isTrap(tile)).length
}

console.log('Part 1:', calcSafeTilesCount(40))
console.log('Part 2:', calcSafeTilesCount(400000))
