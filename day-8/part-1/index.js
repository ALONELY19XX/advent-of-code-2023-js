import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Read entire input file as string
const input = readFileSync(join(__dirname, 'input.txt')).toString()

const moves = {
   right: 'R',
   left: 'L',
}

// Get first line which includes sequence of moves and store individual move instructions in array
const moveSequence = input.replace('\r', '').split('\n').at(0).split('')

// Map which will map a node to its children
// E.g. "AAA" => ["BBB", "CCC"]
const nodesMap = new Map()

// Regex to extract values of parent node, left node and right node of each row
// E.g. consider row: "QKX = (SQD, XTJ)"
// Match: node = "QKX", lnode = "SQD", rnode = XTJ
const nodeMappingRegex =
   /(?<node>[A-Z]{3,3}) = \((?<lnode>[A-Z]{3,3}), (?<rnode>[A-Z]{3,3})\)/g

// Insert parent and child nodes in map
for (let match of input.matchAll(nodeMappingRegex)) {
   const { node, lnode, rnode } = match.groups
   if (!nodesMap.has(node)) {
      nodesMap.set(node, [lnode, rnode])
   }
}

let moveIndex = 0
const totalMoves = moveSequence.length
let currentNode = 'AAA' // we start at node "AAA" (defined in challende)

let moveCounter = 0

while (true) {
   if (currentNode === 'ZZZ') {
      break
   }

   // Get current move (loop if "ZZZ" not found after entire move sequence was processed)
   const move = moveSequence[moveIndex % totalMoves]

   const children = nodesMap.get(currentNode)

   if (move === moves.left) {
      currentNode = children[0] // left child
   } else if (move === moves.right) {
      currentNode = children[1] // right child
   }

   moveCounter++
   moveIndex++
}

console.log('The result is:', moveCounter)
