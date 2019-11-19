import { readLines } from '../utils'

interface GoesCommand {
  kind: 'goes'
  value: number
  bot: number
}

interface GivesCommand {
  kind: 'gives'
  bot: number
  entityLow: string
  indexLow: number
  entityHigh: string
  indexHigh: number
}

type Command = GoesCommand | GivesCommand

const goesPattern = /(?<value>\d+) (?<kind>goes) .+ (?<bot>\d+)/
const givesPattern = /(?<bot>\d+) (?<kind>gives) .+ (?<entityLow>\w+) (?<indexLow>\d+) .+ (?<entityHigh>\w+) (?<indexHigh>\d+)/

const getCommand = (line: string) => {
  const pattern = /goes/.test(line) ? goesPattern : givesPattern
  const match = pattern.exec(line)
  if (!match || !match.groups) throw new Error('Incorrect input')
  const {
    kind,
    value,
    bot,
    entityLow,
    indexLow,
    entityHigh,
    indexHigh
  } = match.groups

  switch (kind) {
    case 'goes':
      return { kind, value: +value, bot: +bot }
    case 'gives':
      return {
        kind,
        bot: +bot,
        entityLow,
        indexLow: +indexLow,
        entityHigh,
        indexHigh: +indexHigh
      }
    default:
      throw new Error('Incorrect input')
  }
}

const instructions: Command[] = readLines('day-10.txt').map(getCommand)

const state = {
  bots: new Map<number, Array<number>>(),
  outputs: new Map<number, number>()
}

function setChipToBot(bot: number, chip: number) {
  const chips = state.bots.get(bot)
  if (chips) chips.push(chip)
  else state.bots.set(bot, [chip])
}

function setChipToOutput(output: number, chip: number) {
  state.outputs.set(output, chip)
}

function transferChip(chip: number, entity: string, entityIndex: number) {
  if (entity === 'bot') {
    setChipToBot(entityIndex, chip)
  } else {
    setChipToOutput(entityIndex, chip)
  }
}

while (instructions.length) {
  const instruction = instructions.shift()!
  switch (instruction.kind) {
    case 'goes':
      setChipToBot(instruction.bot, instruction.value)
      break
    case 'gives':
      const chips = state.bots.get(instruction.bot)
      if (!chips || chips.length < 2) {
        instructions.push(instruction)
      } else {
        chips.sort((a, b) => a - b)
        const [lowest, highest] = chips
        if (lowest === 17 && highest === 61)
          console.log('Part 1:', instruction.bot)
        transferChip(lowest, instruction.entityLow, instruction.indexLow)
        transferChip(highest, instruction.entityHigh, instruction.indexHigh)
        state.bots.set(instruction.bot, [])
      }
      break
  }
}

const output1 = state.outputs.get(0)
const output2 = state.outputs.get(1)
const output3 = state.outputs.get(2)
console.log('Part 2:', output1! * output2! * output3!)
