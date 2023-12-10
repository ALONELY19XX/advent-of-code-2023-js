import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Read entire input file as string
const input = readFileSync(join(__dirname, 'input.txt')).toString()

// Store each row as string in array
const rows = input.split('\n')

// Array to store extrapolated value of each row
const extrapolations = []

// Check if row consists of only zeros
const isFullZeroRow = (row) => !row.some((v) => v !== 0)

// Function to extrapolate a given row following the rules described in the challenge
const extrapolate = (row) => {
   // Array to store processing layers of given row (shaped like flipped pyramid; see challenge)
   const pyramid = []

   // Insert the given row as first row (parsed as number array)
   const firstRow = row
      .trim()
      .split(/\s+/)
      .map((v) => parseInt(v))

   pyramid.push(firstRow)

   // Index will describe level of pyramid row
   let index = 0
   // Control variable to set finished state
   let done = isFullZeroRow(pyramid[index])

   while (!done) {
      const row = pyramid[index]
      const range = row.length - 1
      const nextRow = []

      // compare consecutive values in row and store size of step (-> i to i+1) in array
      for (let i = 0; i < range; ++i) {
         const a = row[i]
         const b = row[i + 1]
         nextRow.push(b - a)
      }

      index++
      pyramid.push(nextRow)
      done = isFullZeroRow(nextRow) || nextRow.length === 1
   }

   // Iterate through rows (last to first, where last is row with only zeros) and extrapolate each pyramid level row
   // This time were extrapolating the beginning of the row
   for (let i = pyramid.length - 1; i >= 0; --i) {
      if (i === pyramid.length - 1) {
         pyramid[i].unshift(0)
      } else {
         const a = pyramid[i + 1].at(0)
         const b = pyramid[i].at(0)
         pyramid[i].unshift(b - a)

         if (i === 0) {
            extrapolations.push(b - a)
         }
      }
   }
}

// Extrapolate each row of input
rows.forEach((row) => {
   extrapolate(row)
})

// Sum up extrapolated values
const result = extrapolations.reduce((acc, value) => {
   acc += value
   return acc
}, 0)

console.log('The result is:', result)
