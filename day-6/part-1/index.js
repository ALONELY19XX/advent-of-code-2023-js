import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Read entire input file as string
const input = readFileSync(join(__dirname, 'input.txt')).toString()

// Store line (as string) for times and distances
const [timesRow, distancesRow] = input.split('\n')

// Parse times row to hold times as integers in array
const times = timesRow
   .split(':')[1]
   .trim()
   .split(/\s+/)
   .map((entry) => parseInt(entry))

// Parse distances row to hold distances as integers in array
const distances = distancesRow
   .split(':')[1]
   .trim()
   .split(/\s+/)
   .map((entry) => parseInt(entry))

// Total amount of rounds
const rounds = times.length

// Array to hold the amounts of game-winning strategies for each round (index 0 refers to round 1)
const amountWinningStrategies = []

// Process each round
for (let i = 0; i < rounds; ++i) {
   const roundTime = times[i]
   const roundRecord = distances[i]
   let recordBeatingStrategies = 0

   // Check how far boat will drive by incrementing charge times
   for (let j = 0; j < roundTime; ++j) {
      const chargeTime = j
      const timeToTravel = roundTime - chargeTime
      if (chargeTime * timeToTravel > roundRecord) {
         recordBeatingStrategies++
      }
   }

   // Store amount of game-winning strategies for given round
   amountWinningStrategies.push(recordBeatingStrategies)
}

// Get result
const result = amountWinningStrategies
   .filter((amount) => amount > 0)
   .reduce((acc, amount) => {
      if (acc === 0) {
         acc = amount
      } else {
         acc *= amount
      }

      return acc
   }, 0)

console.log('The result is:', result)
