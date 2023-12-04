import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Limits for each cube colors (defined by challenge)
const cubeLimits = {
   red: 12,
   green: 13,
   blue: 14,
}

// Regexes to extract amount before each color
const regexReds = /(\d+) red/gi
const regexGreens = /(\d+) green/gi
const regexBlues = /(\d+) blue/gi

// Regex to extract game ID/number
const regexGameId = /Game (\d+)/gi

// Delimiter to split game info ("Game X") from game data ("X red, Y green, <...>")
const lineInfoDelimiter = ':'

// Buffer to hold target game IDs/numbers
const numbers = []

// Readline interface, so we can read the input file line-by-line instead of all-at-once
const rl = createInterface({
   input: createReadStream(join(__dirname, 'input.txt')),
})

// Once new line is read
rl.on('line', (line) => {
   // Split line
   const [gameInfo, coloroOccurences] = line.split(lineInfoDelimiter)

   // Get game ID (only the number)
   const gameId = gameInfo.replace(regexGameId, '$1')

   // Get list of all occurences of red cubes
   // e.g. "X red, <...>; Y red, <...>; Z red, <...>" -> [X, Y, Z]
   const reds = coloroOccurences
      .match(regexReds)
      .map((match) => match.replace(regexReds, '$1'))
      .map((v) => parseInt(v))

   // Get list of all occurences of green cubes
   // e.g. "X green, <...>; Y green, <...>; Z green, <...>" -> [X, Y, Z]
   const greens = coloroOccurences
      .match(regexGreens)
      .map((match) => match.replace(regexGreens, '$1'))
      .map((v) => parseInt(v))

   // Get list of all occurences of blue cubes
   // e.g. "X blue, <...>; Y blue, <...>; Z blue, <...>" -> [X, Y, Z]
   const blues = coloroOccurences
      .match(regexBlues)
      .map((match) => match.replace(regexBlues, '$1'))
      .map((v) => parseInt(v))

   // Get max value for each color
   const maxReds = Math.max(...reds)
   const maxGreens = Math.max(...greens)
   const maxBlues = Math.max(...blues)

   // If all max color occurrences are below the cube color's max thresholds
   // then add game ID/number to tracking list
   if (
      maxReds <= cubeLimits.red &&
      maxGreens <= cubeLimits.green &&
      maxBlues <= cubeLimits.blue
   ) {
      numbers.push(gameId)
   }
})

// Wait until all lines were processed
await once(rl, 'close')

// Get result
const result = numbers.reduce((acc, num) => (acc += parseInt(num)), 0)

console.log('The result is:', result)
