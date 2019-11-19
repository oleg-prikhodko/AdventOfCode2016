import { readLines, range } from '../utils'

interface Disc {
  id: number
  totalPositions: number
  currentPosition: number
}

function getNewDiscState(currentDiscState: Disc, time: number) {
  const timeToReach = time + currentDiscState.id
  const newPosition =
    (currentDiscState.currentPosition + timeToReach) %
    currentDiscState.totalPositions
  return { ...currentDiscState, currentPosition: newPosition }
}

function wouldFallThrough(discs: Disc[]) {
  return discs.every(({ currentPosition }) => currentPosition === 0)
}

function calcTimeToPress(discs: Disc[]) {
  for (const time of range(1, Number.MAX_VALUE)) {
    if (wouldFallThrough(discs.map(disc => getNewDiscState(disc, time))))
      return time
  }
}

const discPattern = /(?<id>\d+).+ (?<total>\d+).+(?<current>\d+)\.$/

const initialState: Disc[] = readLines('day-15.txt').map(line => {
  const { id, total, current } = line.match(discPattern)!.groups!
  return { id: +id, totalPositions: +total, currentPosition: +current }
})

console.log('Part 1:', calcTimeToPress(initialState))

const additionalDisc = {
  id: 7,
  totalPositions: 11,
  currentPosition: 0
}
console.log('Part 2:', calcTimeToPress([...initialState, additionalDisc]))
