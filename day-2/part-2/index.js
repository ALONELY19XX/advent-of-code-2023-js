import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Regexes to extract amount before each color
const regexReds = /(\d+) red/gi
const regexGreens = /(\d+) green/gi
const regexBlues = /(\d+) blue/gi

// Buffer to hold each game "power" (multiplication of minumum required red, green and blue cubes)
const powers = []

// Readline interface, so we can read the input file line-by-line instead of all-at-once
const rl = createInterface({
   input: createReadStream(join(__dirname, 'input.txt')),
})

// Once new line is read
rl.on('line', (line) => {
   // Get list of all occurences of red cubes
   // e.g. "X red, <...>; Y red, <...>; Z red, <...>" -> [X, Y, Z]
   const reds = line
      .match(regexReds)
      .map((match) => match.replace(regexReds, '$1'))
      .map((v) => parseInt(v))

   // Get list of all occurences of green cubes
   // e.g. "X green, <...>; Y green, <...>; Z green, <...>" -> [X, Y, Z]
   const greens = line
      .match(regexGreens)
      .map((match) => match.replace(regexGreens, '$1'))
      .map((v) => parseInt(v))

   // Get list of all occurences of blue cubes
   // e.g. "X blue, <...>; Y blue, <...>; Z blue, <...>" -> [X, Y, Z]
   const blues = line
      .match(regexBlues)
      .map((match) => match.replace(regexBlues, '$1'))
      .map((v) => parseInt(v))

   // Get max value for each color
   const maxReds = Math.max(...reds)
   const maxGreens = Math.max(...greens)
   const maxBlues = Math.max(...blues)

   // Since "Math.max" returns "-Infinity" if maxReds, maxGreens or maxBlues is empty array
   // we need to sanitize it by providing a fallback value which does not affect the multiplication
   const factorRed = maxReds === -Infinity ? 1 : maxReds
   const factorGreen = maxGreens === -Infinity ? 1 : maxGreens
   const factorBlue = maxBlues === -Infinity ? 1 : maxBlues

   // Compute "power" (as defined in challenge)
   const power = factorRed * factorGreen * factorBlue

   powers.push(power)
})

// Wait until all lines were processed
await once(rl, 'close')

// Get result
const result = powers.reduce((acc, num) => (acc += num), 0)

console.log('The result is:', result)
