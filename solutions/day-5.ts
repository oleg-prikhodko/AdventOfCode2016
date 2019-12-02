import { range, md5 } from '../utils'

function* getHex(data: string, limit: number = 8) {
  let count = 0
  for (const num of range(0, Number.MAX_VALUE)) {
    const hex = md5(`${data}${num}`)
    if (/^0{5,}/.test(hex)) {
      count++
      yield hex
      if (count === limit) break
    }
  }
}

function genPassword(doorId: string) {
  return Array.from(getHex(doorId))
    .map(hex => hex[5])
    .join('')
}

const doorId = 'ojvtpuvg'

console.log(`Part 1: ${genPassword(doorId)}`)

function genPassword2(doorId: string) {
  let pass: string[] = Array(8).fill('_')
  for (const hex of getHex(doorId, Number.MAX_VALUE)) {
    const position = +hex[5]
    if (position >= 0 && position <= 7 && pass[position] === '_') {
      pass[position] = hex[6]
      // console.log(pass.join(''))
      if (!pass.includes('_')) break
    }
  }
  return pass.join('')
}

console.log(`Part 2: ${genPassword2(doorId)}`)
