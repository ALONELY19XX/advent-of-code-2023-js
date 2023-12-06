import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Readline interface, so we can read the input file line-by-line instead of all-at-once
const rl = createInterface({
   input: createReadStream(join(__dirname, 'input.txt')),
})

// Each Array index holds the amount of cards for the given card number
// Since arrays are zero-indexed, the representation is established:
// Index 0 -> holds total amount of Card 1
// Index 1 -> holds total amount of Card 2
// ...
// Index N -> holds total amount of Card N+1
const indexedCardSets = []

let cardNo = 0 // Current card number (zero-indexed; here 0 refers to Card 1)

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

   // If its the first card (which only exists once we set it to 1)
   if (cardNo === 0) {
      indexedCardSets.push(1)
   }
   // Otherwise
   else {
      // If no previous card match created copies for the current card
      // (meaning the array at the index for this card holds no value)
      // we have to initialize it by setting it to 1
      // info: it will stay at 1, since no card following this one can increase previous cards
      if (indexedCardSets[cardNo] === undefined) {
         indexedCardSets[cardNo] = 1
      }
      // If previous card matches created copies for the current card before
      // we have to increase the counter for this card by one (to include the original card)
      else {
         indexedCardSets[cardNo]++
      }
   }

   // For each match modify the range (= total matches) of subsequent cards
   for (let i = 1; i <= totalMatchingNumbers; ++i) {
      // If subsequent cards is not tracking any copy counter yet, initialize by
      // amount of current card, since each instance of the current card (original+copies)
      // will create a copy for the subsequent card
      if (indexedCardSets[cardNo + i] === undefined) {
         indexedCardSets[cardNo + i] = indexedCardSets[cardNo]
      }
      // If subsequent cards is already tracking copy counter, modify by
      // amount of current card, since each instance of the current card (original+copies)
      // will create a copy for the subsequent card
      else {
         indexedCardSets[cardNo + i] += indexedCardSets[cardNo]
      }
   }

   // increase card number as we are about to move to next line of input file -> next card
   cardNo++
})

// Wait until all lines were processed
await once(rl, 'close')

console.log(indexedCardSets)

// Get result
const result = indexedCardSets.reduce((acc, num) => (acc += num), 0)

console.log('The result is:', result)
