import { range, getRowCol } from '../utils'

function isOpenSpace(x: number, y: number, favorite: number = 1350) {
  const sum = x * x + 3 * x + 2 * x * y + y + y * y + favorite
  const isOne = (char: string) => char === '1'
  const ones = Array.prototype.filter.call(sum.toString(2), isOne)
  return ones.length % 2 === 0
}

function getAdjacentOpenSpaces(x: number, y: number) {
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(
    ([x, y]) =>
      x >= 0 && x < MAX_SIDE && y >= 0 && y < MAX_SIDE && isOpenSpace(x, y)
  )
}

const MAX_SIDE = 75

const graph = new Map(
  Array.from(range(0, MAX_SIDE ** 2 - 1))
    .map(index => getRowCol(index, MAX_SIDE).reverse())
    .filter(([x, y]) => isOpenSpace(x, y))
    .map(([x, y]) => [
      JSON.stringify({ x, y }),
      getAdjacentOpenSpaces(x, y).map(([x, y]) => JSON.stringify({ x, y }))
    ])
)

function search(
  startVertex: string,
  condition: (current: { val: string; distance: number }) => boolean
) {
  let current = { val: startVertex, distance: 0 }
  const path = [current]
  const visited = new Set([current.val])
  let border = graph.get(current.val)!.map(val => ({ val, distance: 1 }))

  while (condition(current) && border.length) {
    current = border.reduce((min, vertex) =>
      vertex.distance < min.distance ? vertex : min
    )
    visited.add(current.val)
    path.push(current)
    border = border.filter(({ val }) => val !== current.val)

    const newBorder = graph
      .get(current.val)!
      .map(val => ({ val, distance: current.distance + 1 }))
      .filter(({ val }) => !visited.has(val))

    border = [...border, ...newBorder]
  }
  return path
}

const startPosition = JSON.stringify({ x: 1, y: 1 })

const targetPosition = JSON.stringify({ x: 31, y: 39 })
const notEqualTo = (current: { val: string }) => current.val !== targetPosition
console.log(
  `Part 1: ${search(startPosition, notEqualTo).slice(-1)[0].distance}`
)

const targetDistance = 51
const lessThan = (current: { distance: number }) =>
  current.distance < targetDistance
console.log(`Part 2: ${search(startPosition, lessThan).length - 1}`)
