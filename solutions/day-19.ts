import { range } from '../utils'

interface Elf {
  id: number
  presents: number
  nextId: number
  prevId: number
}

function getElves(numberOfElves: number) {
  return new Map<number, Elf>(
    Array.from(range(1, numberOfElves), id => [
      id,
      {
        id,
        presents: 1,
        nextId: id === numberOfElves ? 1 : id + 1,
        prevId: id === 1 ? numberOfElves : id - 1
      }
    ])
  )
}

function getFirstElfToStealFrom(
  elves: Map<number, Elf>,
  elf: Elf,
  part2: boolean
) {
  if (part2) {
    let distanceToElf = Math.ceil((elves.size - 1) / 2)
    let elfToStealFrom = elf
    while (distanceToElf > 0) {
      elfToStealFrom = elves.get(elfToStealFrom.nextId)!
      distanceToElf--
    }
    return elfToStealFrom
  } else {
    return elves.get(elf.nextId)!
  }
}

function getLastElf(numberOfElves: number, part2 = false) {
  const elves = getElves(numberOfElves)
  let elf = elves.get(1)!
  let elfToStealFrom = getFirstElfToStealFrom(elves, elf, part2)

  while (elves.size > 1) {
    elf.presents += elfToStealFrom.presents
    elfToStealFrom.presents = 0

    const nextElf = elves.get(elfToStealFrom.nextId)!
    const prevElf = elves.get(elfToStealFrom.prevId)!
    prevElf.nextId = nextElf.id
    nextElf.prevId = prevElf.id
    elves.delete(elfToStealFrom.id)

    elf = elves.get(elf.nextId)!
    if (part2) {
      elfToStealFrom = elves.get(elfToStealFrom.nextId)!
      if ((elves.size - 1) % 2 === 1) {
        elfToStealFrom = elves.get(elfToStealFrom.nextId)!
      }
    } else {
      elfToStealFrom = elves.get(elf.nextId)!
    }
  }

  return elf
}

const numberOfElves = 3017957
console.log('Part 1:', getLastElf(numberOfElves))
console.log('Part 2:', getLastElf(numberOfElves, true))
