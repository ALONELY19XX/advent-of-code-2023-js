import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Map each hand-type to a weight/value
// high card (all cards are different) is assigned lowest value
// five of a kind (five times the same card) is assigned highest value
// (order is defined by the challenge)
const handTypeValues = {
   highCard: 0,
   onePair: 1,
   twoPair: 2,
   threeOfAKind: 3,
   fullHouse: 4,
   fourOfAKind: 5,
   fiveOfAKind: 6,
}

// Map each pattern to a hand-type name (matches keys of "handTypeValues")
// E.g.
// "1-1-1-1-1" -> All cards are unique -> high card
// "1-1-1-2" -> 3 cards are unique, one card appears twice -> one pair
// ...
// "5" -> one card appears 5 times -> five of a kind
const handTypePatterns = {
   '1-1-1-1-1': 'highCard',
   '1-1-1-2': 'onePair',
   '1-2-2': 'twoPair',
   '1-1-3': 'threeOfAKind',
   '2-3': 'fullHouse',
   '1-4': 'fourOfAKind',
   5: 'fiveOfAKind',
}

// Map each card to a value
// "A" (Ace) is assigned the biggest value
// "2" is assigned the lowest value
// (Values are defined in challenge)
const cardValues = {
   A: 13,
   K: 12,
   Q: 11,
   J: 10,
   T: 9,
   9: 8,
   8: 7,
   7: 6,
   6: 5,
   5: 4,
   4: 3,
   3: 2,
   2: 1,
}

// Read entire input file as string
const input = readFileSync(join(__dirname, 'input.txt')).toString()

// Array of individual rows (hand + bid)
const rows = input.split('\n')

// Create hand object out of each row with basic information about hand
const hands = rows.map((row, index) => {
   const [cards, bid] = row.split(' ')
   return {
      id: index,
      cards,
      bid: parseInt(bid),
      typeValue: null,
      typeName: null,
   }
})

// Returns an object which maps a given card to the amount of times it appears in the given hand
// (The object only tracks cards which are present in the given hand)
const getCardOccurrences = (hand) => {
   const occurrences = {}
   for (let i = 0; i < hand.cards.length; ++i) {
      const card = hand.cards[i]
      if (occurrences[card] === undefined) {
         occurrences[card] = 1
      } else {
         occurrences[card]++
      }
   }
   return occurrences
}

// Defines the type of a given hand and updates the hand object with the findings
// Each processed hand will have a type-name and type-value, representing the value of the hand
const defineHandType = (hand) => {
   const occurrences = Object.values(getCardOccurrences(hand)).sort(
      (a, b) => a - b
   )
   const typePattern = occurrences.join('-')
   const typePatternName = handTypePatterns[typePattern]
   const typePatternValue = handTypeValues[typePatternName]
   hand.typeValue = typePatternValue
   hand.typeName = typePatternName
}

// Caomparator function in case two hands have the same value
// Compare cards position-by-position until one hand has stronger card
const compareHands = (hand1, hand2) => {
   const totalCards = hand1.cards.length
   for (let i = 0; i < totalCards; ++i) {
      const card1 = hand1.cards[i]
      const card2 = hand2.cards[i]
      const card1Strength = cardValues[card1]
      const card2Strength = cardValues[card2]

      if (card1Strength > card2Strength) {
         return 1
      }

      if (card2Strength > card1Strength) {
         return -1
      }
   }
   return 0
}

// Define the hand type for each hand
hands.forEach((hand) => defineHandType(hand))

// Sort by the hand type / stronger hands
hands.sort((hand1, hand2) => {
   if (hand1.typeValue < hand2.typeValue) {
      return -1
   }

   if (hand2.typeValue < hand1.typeValue) {
      return 1
   }

   return compareHands(hand1, hand2)
})

// The positions of each hand in the hands array represents its rank
// (Since arrays are zero-indexed we get the rank for the calculation by "rank = index + 1")
const result = hands.reduce((acc, hand, index) => {
   const rank = index + 1
   const bid = hand.bid
   acc += bid * rank
   return acc
}, 0)

console.log('The result is:', result)
