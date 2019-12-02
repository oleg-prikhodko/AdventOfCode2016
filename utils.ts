import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

export function readInputFile(inputFileName: string) {
  const fullPath = join(__dirname, 'inputs', inputFileName)
  if (existsSync(fullPath)) {
    return readFileSync(fullPath, 'utf8').trim()
  } else {
    throw new Error('File do not exist')
  }
}

export function readLines(inputFileName: string) {
  return readInputFile(inputFileName).split('\n')
}

export function* range(start: number, limit: number) {
  let count = start
  while (count !== limit) {
    yield count < limit ? count++ : count--
  }
  yield count
}

export function getRowCol(index: number, side: number) {
  const row = Math.floor(index / side)
  const col = index % side
  return [row, col]
}

export function getIndex(row: number, col: number, side: number) {
  return side * row + col
}

type Order = 'desc' | 'asc'

export function countLetters(str: string, limit: number, sort: Order = 'desc') {
  const counter = new Map<string, number>()
  str.split('').forEach(char => {
    const count = counter.get(char)
    if (count) counter.set(char, count + 1)
    else counter.set(char, 1)
  })
  const comparator = (a: [string, number], b: [string, number]) => {
    const [aChar, aCount] = a
    const [bChar, bCount] = b
    const aCodePoint = aChar.charCodeAt(0)
    const bCodePoint = bChar.charCodeAt(0)
    const diff = sort === 'desc' ? bCount - aCount : aCount - bCount
    return bCount === aCount ? aCodePoint - bCodePoint : diff
  }
  return Array.from(counter.entries())
    .sort(comparator)
    .slice(0, limit)
}

export function mostCommon(str: string) {
  const [[letter]] = countLetters(str, 1)
  return letter
}

export function leastCommon(str: string) {
  const [[letter]] = countLetters(str, 1, 'asc')
  return letter
}

export function make2d<T>(arr: Array<T>, width: number) {
  return arr.reduce((acc, val, index) => {
    const idx = Math.floor(index / width)
    if (!acc[idx]) acc[idx] = [val]
    else acc[idx].push(val)
    return acc
  }, Array<Array<T>>())
}

interface Node<T> {
  value: T
  prev?: Node<T>
  next?: Node<T>
}

export class Queue<T> {
  private first?: Node<T>
  private last?: Node<T>

  constructor(els?: T[]) {
    if (els) els.forEach(this.add.bind(this))
  }

  add(el: T) {
    const node = this.last ? { prev: this.last, value: el } : { value: el }
    if (this.last) {
      this.last.next = node
      this.last = node
    } else {
      this.first = node
      this.last = node
    }
  }

  remove() {
    const first = this.first
    if (first) {
      const next = first.next
      if (next) {
        next.prev = undefined
        if (!next.next) this.last = next
        this.first = next
      } else {
        this.first = undefined
        this.last = undefined
      }
      return first.value
    }
  }
}

export function md5(data: string) {
  return createHash('md5')
    .update(data)
    .digest('hex')
}
