import { readLines } from '../utils'

interface Range {
  lower: number
  upper: number
}

const allowedRanges: Range[] = []
const blockedRanges: Range[] = readLines('day-20.txt')
  .map(line => {
    const { lower, upper } = /(?<lower>\d+)-(?<upper>\d+)/.exec(line)!.groups!
    return { lower: +lower, upper: +upper }
  })
  .sort((a, b) => a.lower - b.lower)

let candidate = 0
for (const blockedRange of blockedRanges) {
  if (blockedRange.lower <= candidate) {
    candidate =
      blockedRange.upper > candidate ? blockedRange.upper + 1 : candidate
  } else {
    allowedRanges.push({ lower: candidate, upper: blockedRange.lower - 1 })
    candidate = blockedRange.upper + 1
  }
}

const upperBoundary = 4294967295
const [lastAllowed] = allowedRanges.slice(-1)
const maxUpperBlocked = blockedRanges.reduce((max, range) => {
  return range.upper > max ? range.upper : max
}, 0)
if (lastAllowed.upper < upperBoundary && maxUpperBlocked < upperBoundary) {
  allowedRanges.push({ lower: maxUpperBlocked + 1, upper: upperBoundary })
}

const allowedCount = allowedRanges.reduce((sum, range) => {
  return sum + (range.upper - range.lower + 1)
}, 0)

console.log('Part 1:', allowedRanges[0].lower)
console.log('Part 2:', allowedCount)
