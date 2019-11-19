import { readLines } from '../utils'

type Triangle = [number, number, number]

function isPossible([a, b, c]: Triangle) {
  return a + b > c && a + c > b && b + c > a
}

const pattern = /(\d+)\s+(\d+)\s+(\d+)/

const triangles = readLines('day-3.txt').map(line => {
  const match = pattern.exec(line)
  if (!match) throw new Error('Incorrect input')
  const [, ...sides] = match
  return sides.map(Number) as Triangle
})

console.log(`Part 1: ${triangles.filter(isPossible).length}`)

function getGroupReducer(getGroup: (index: number) => number) {
  return (acc: Array<Array<number>>, num: number, index: number) => {
    const group = getGroup(index)
    if (!acc[group]) acc[group] = [num]
    else acc[group].push(num)
    return acc
  }
}

type Array2D<T> = Array<Array<T>>

const groupEveryThird = (index: number) => index % 3
const groupByThree = (index: number) => Math.floor(index / 3)

const trianglesVertical = triangles
  .flat()
  .reduce(getGroupReducer(groupEveryThird), [] as Array2D<number>)
  .flat()
  .reduce(getGroupReducer(groupByThree), [] as Array2D<number>)
  .map(([a, b, c]) => [a, b, c] as Triangle)

console.log(`Part 2: ${trianglesVertical.filter(isPossible).length}`)
