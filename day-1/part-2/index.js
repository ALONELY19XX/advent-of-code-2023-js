import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Map digits (number representation & spelled-out) to digit string
const digitsMap = {
   zero: '0',
   one: '1',
   two: '2',
   three: '3',
   four: '4',
   five: '5',
   six: '6',
   seven: '7',
   eight: '8',
   nine: '9',
   0: '0',
   1: '1',
   2: '2',
   3: '3',
   4: '4',
   5: '5',
   6: '6',
   7: '7',
   8: '8',
   9: '9',
}

// Function to get first and last digit string (as number representation or spelled-out) from line
const getFirstAndLastDigitFromLine = (line) => {
   // Initial pair of number + index (in case line contains no digit, then line result will be 0 -> no impact)
   let firstDigitWithIndex = ['0', Infinity]
   let lastDigitWithIndex = ['0', -Infinity]

   // Iterate through every key (string) of digitsMap
   Object.keys(digitsMap).forEach((digitKey) => {
      // Get all occurrences (as indices) of digit (key)
      const indices = [...line.matchAll(new RegExp(digitKey, 'gi'))].map(
         (hit) => hit.index
      )

      // For each occurrence (as index) check:
      indices.forEach((index) => {
         // If occurrence (as index) is before current "first digit" candidate
         if (index < firstDigitWithIndex[1]) {
            // If yes, set this occurence as new "first digit" candidate
            firstDigitWithIndex = [digitKey, index]
         }

         // If occurrence (as index) is after current "last digit" candidate
         if (index > lastDigitWithIndex[1]) {
            // If yes, set this occurence as new "last digit" candidate
            lastDigitWithIndex = [digitKey, index]
         }
      })
   })

   // Return tuple of first and last digit candidates
   // [info] In case line included no digit, then this will return ['0', '0'] (default candidates)
   // [info] In case line included only one digit, then this will return ['<first-digit>', '<first-digit>'] (due to above logic)
   return [firstDigitWithIndex[0], lastDigitWithIndex[0]]
}

// List to store each 2-digit number of line
const numbers = []

// Readline interface, so we can read the input file line-by-line instead of all-at-once
const rl = createInterface({
   input: createReadStream(join(__dirname, 'input.txt')),
})

// Once new line is read
rl.on('line', (line) => {
   // local buffer for characters of read line which represent a digit
   const digits = []

   // Get keys (for digitsMap) for first and last digit occurrences in line
   const [firstDigitKey, lastDigitKey] = getFirstAndLastDigitFromLine(line)

   // Concatenate and push to buffer
   numbers.push(parseInt(digitsMap[firstDigitKey] + digitsMap[lastDigitKey]))
})

// Wait until all lines were processed
await once(rl, 'close')

// Get result
const result = numbers.reduce((acc, num) => (acc += num), 0)

console.log('The result is:', result)
