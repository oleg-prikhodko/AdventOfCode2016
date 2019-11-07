import { createHash } from 'crypto'
import { range } from '../utils'

function getMD5(data: string) {
  return createHash('md5')
    .update(data)
    .digest('hex')
}

type HashGenerator = Generator<[string, number]>

function* getHashGen(salt: string, limit: number): HashGenerator {
  for (const index of range(0, limit)) {
    yield [getMD5(`${salt}${index}`), index]
  }
}

function* getStretchedHashGen(salt: string, limit: number): HashGenerator {
  for (const [hash, index] of getHashGen(salt, limit)) {
    const stretchedHash = Array.from(range(0, 2015)).reduce(getMD5, hash)
    yield [stretchedHash, index]
  }
}

function isKey(hashes: [string, number][]) {
  const [[hash], ...rest] = hashes
  const tripletMatch = hash.match(/(?<char>.)\1{2}/)
  if (!tripletMatch) return false
  const char = tripletMatch.groups!.char
  const quintetPattern = new RegExp(`(${char})\\1{4}`, 'g')
  const quintet = rest.find(([h]) => quintetPattern.test(h))
  return !!quintet
}

function* window<T>(length: number, arr: T[]) {
  let start = 0
  while (start + length <= arr.length) {
    yield arr.slice(start, start + length)
    start++
  }
}

function calculateKeys(hashGenerator: HashGenerator) {
  const hashes = Array.from(hashGenerator)
  const windows = Array.from(window(1001, hashes))
  const keys = windows.filter(isKey).map(([key]) => key)
  return keys
}

const salt = 'ngcjuoqr'
const maxPasses = 25_000

let keys = calculateKeys(getHashGen(salt, maxPasses))
console.log('Part 1:', keys[63])

keys = calculateKeys(getStretchedHashGen(salt, maxPasses))
console.log('Part 2:', keys[63])
