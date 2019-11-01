import { readInputFile } from '../utils'

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

const instructions: Command[] = readInputFile('day-10.txt')
  .split('\n')
  .map(line => {
    const pattern = /goes/.test(line) ? goesPattern : givesPattern
    const match = pattern.exec(line)
    if (!match || !match.groups) throw new Error('Incorrect input')
    switch (match.groups.kind as 'goes' | 'gives') {
      case 'goes':
        return {
          kind: match.groups.kind,
          value: +match.groups.value,
          bot: +match.groups.bot
        } as GoesCommand
      case 'gives':
        return {
          kind: match.groups.kind,
          bot: +match.groups.bot,
          entityLow: match.groups.entityLow,
          indexLow: +match.groups.indexLow,
          entityHigh: match.groups.entityHigh,
          indexHigh: +match.groups.indexHigh
        } as GivesCommand
    }
  })

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
