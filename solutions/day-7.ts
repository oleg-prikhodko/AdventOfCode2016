import { readLines } from '../utils'

function hasABBA(str: string): boolean {
  if (str.length < 4) {
    return false
  } else if (str.length === 4) {
    const [a1, b1, b2, a2] = str
    return a1 !== b1 && a1 === a2 && b1 === b2
  } else {
    return hasABBA(str.slice(0, 4)) || hasABBA(str.slice(1))
  }
}

function getSequences(ip: string) {
  const hypernetPattern = /\[\w+\]/g
  const match = ip.match(hypernetPattern)
  if (!match) throw new Error('Incorrect input')
  const hypernetSeqs = match.map(hypernetSeq => hypernetSeq.slice(1, -1))
  const supernetSeqs = ip.split(
    new RegExp(match.join('|').replace(/\[|\]/g, '\\$&'))
  )
  return { hypernetSeqs, supernetSeqs }
}

const ips = readLines('day-7.txt')

const supportsTLS = ips.filter(ip => {
  const { hypernetSeqs, supernetSeqs } = getSequences(ip)
  return !hypernetSeqs.some(hasABBA) && supernetSeqs.some(hasABBA)
})

console.log(`Part 1: ${supportsTLS.length}`)

function getABAs(supernetSeq: string): string[] {
  if (supernetSeq.length < 3) {
    return []
  } else if (supernetSeq.length === 3) {
    const [a1, b, a2] = supernetSeq
    return a1 === a2 && a1 !== b ? [supernetSeq] : []
  } else {
    return getABAs(supernetSeq.slice(0, 3)).concat(
      getABAs(supernetSeq.slice(1))
    )
  }
}

function hasBAB(str: string, aba: string) {
  const [a, b] = aba
  const bab = b + a + b
  return new RegExp(bab).test(str)
}

const supportsSSL = ips.filter(ip => {
  const { hypernetSeqs, supernetSeqs } = getSequences(ip)
  const abaList = supernetSeqs.map(getABAs).flat()
  return hypernetSeqs.some(hypernetSeq =>
    abaList.some(aba => hasBAB(hypernetSeq, aba))
  )
})

console.log(`Part 2: ${supportsSSL.length}`)
