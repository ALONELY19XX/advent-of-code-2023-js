import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Buffer to hold points for each card
const points = []

// Readline interface, so we can read the input file line-by-line instead of all-at-once
const rl = createInterface({
   input: createReadStream(join(__dirname, 'input.txt')),
})

// Once new line is read
rl.on('line', (line) => {
   // Get different sections of card
   const [cardInfoSection, winningNumbersSection, pickedNumbersSection] =
      line.split(/[:|]/)

   // Transform winning numbers section string to list of numbers
   const winningNumbers = winningNumbersSection
      .trim()
      .split(/\s+/)
      .map((num) => parseInt(num))

   // Transform picked numbers section string to list of numbers
   const pickedNumbers = pickedNumbersSection
      .trim()
      .split(/\s+/)
      .map((num) => parseInt(num))

   // counter to track total matches for given card
   let totalMatchingNumbers = 0

   // check how many of the winning numbers were picked
   winningNumbers.forEach((winningNumber) => {
      if (pickedNumbers.includes(winningNumber)) {
         totalMatchingNumbers++
      }
   })

   // Formula for more than one match: 2^(totalMatches-1)
   if (totalMatchingNumbers > 1) {
      points.push(Math.pow(2, totalMatchingNumbers - 1))
   }
   // Otherwise push 0 or 1 (no further logic required for these cases)
   else {
      points.push(totalMatchingNumbers)
   }
})

// Wait until all lines were processed
await once(rl, 'close')

// Get result
const result = points.reduce((acc, num) => (acc += num), 0)

console.log('The result is:', result)
