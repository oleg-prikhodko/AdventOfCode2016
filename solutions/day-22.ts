import { readLines } from '../utils'

interface Node {
  x: number
  y: number
  size: number
  used: number
  avail: number
  use: number
}

const nodePattern = /x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/

const nodes: Node[] = readLines('day-22.txt')
  .slice(2)
  .map(line => {
    const match = nodePattern.exec(line)!
    const [, x, y, size, used, avail, use] = match
    return { x: +x, y: +y, size: +size, used: +used, avail: +avail, use: +use }
  })

function getPairs<T>(arr: T[]) {
  const pairs: T[][] = []
  for (const [index, element] of arr.entries()) {
    for (const nextElement of arr.slice(index + 1)) {
      pairs.push([element, nextElement])
    }
  }
  return pairs
}

function isViablePair(pairOfNodes: Node[]) {
  const [nodeA, nodeB] = pairOfNodes
  return (
    (nodeA.used !== 0 && nodeB.avail >= nodeA.used) ||
    (nodeB.used !== 0 && nodeA.avail >= nodeB.used)
  )
}

const pairs = getPairs(nodes)
console.log('Part 1:', pairs.filter(isViablePair).length)
