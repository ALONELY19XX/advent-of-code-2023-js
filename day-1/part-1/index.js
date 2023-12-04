import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Helper function to check if a given character represents a digit
const charIsDigit = (char) => char >= '0' && char <= '9'

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

   // Iterate over every character in the line string
   for (const char of line) {
      // If character represents a digit, then push it into the local buffer
      if (charIsDigit(char)) {
         digits.push(char)
      }
   }

   // Get first and last
   const firstDigit = digits.at(0)
   const lastDigit = digits.at(-1)

   // If there is a digit in the local buffer, construct 2-digit number and push it to buffer
   if (firstDigit !== undefined) {
      numbers.push(parseInt(firstDigit + lastDigit))
   }
})

// Wait until all lines were processed
await once(rl, 'close')

// Get result
const result = numbers.reduce((acc, num) => (acc += num), 0)

console.log('The result is:', result)
