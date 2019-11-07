import { equal, deepStrictEqual } from 'assert'

function addData(initialData: string) {
  const a = initialData
  const b = initialData
    .split('')
    .reverse()
    .map(char => (char === '0' ? '1' : '0'))
    .join('')
  return a + '0' + b
}

equal(addData('1'), '100')
equal(addData('0'), '001')
equal(addData('11111'), '11111000000')
equal(addData('111100001010'), '1111000010100101011110000')

function* splitBy(str: string, step = 2) {
  let start = 0
  while (start <= str.length - step) {
    yield str.slice(start, start + step)
    start += step
  }
}

deepStrictEqual([...splitBy('001100')], ['00', '11', '00'])

function getChecksum(data: string): string {
  let checksum = ''
  for (const pair of splitBy(data)) {
    if (/(.)\1/.test(pair)) checksum += '1'
    else checksum += '0'
  }
  return checksum.length % 2 !== 0 ? checksum : getChecksum(checksum)
}

equal(getChecksum('110010110100'), '100')

function fillDisc(initialData: string, diskLength: number) {
  let data = initialData
  while (data.length < diskLength) {
    data = addData(data)
  }
  return data.slice(0, diskLength)
}

equal(fillDisc('10000', 20), '10000011110010000111')

const initialData = '01110110101001000'

console.log('Part 1', getChecksum(fillDisc(initialData, 272)))
console.log('Part 2', getChecksum(fillDisc(initialData, 35651584)))
