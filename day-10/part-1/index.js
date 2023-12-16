import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Read entire input file as string
const input = readFileSync(join(__dirname, 'input.txt')).toString()

// Moves
const moves = {
   up: 'up',
   down: 'down',
   left: 'left',
   right: 'right',
   stop: 'stop',
}

// Get 2D array of pipes/cells
const grid = input.split('\n').map((row) => row.replace('\r', '').split(''))

// Dimensions of grid
const rows = grid.length
const columns = grid[0].length

// Get object describing start cell
// Object of form: { pipe: "<symbol>", x: <col>, y: <row> }
const findStartCell = (grid) => {
   let cell
   for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < columns; ++j) {
         if (grid[i][j] === 'S') {
            cell = { pipe: 'S', x: j, y: i }
            return cell
         }
      }
   }
}

const getNextMove = (fromMove, cell) => {
   switch (fromMove) {
      case moves.up:
         if (cell === '|') {
            return moves.up
         } else if (cell === '7') {
            return moves.left
         } else if (cell === 'F') {
            return moves.right
         }
      case moves.down:
         if (cell === '|') {
            return moves.down
         } else if (cell === 'L') {
            return moves.right
         } else if (cell === 'J') {
            return moves.left
         }
      case moves.right:
         if (cell === '-') {
            return moves.right
         } else if (cell === 'J') {
            return moves.up
         } else if (cell === '7') {
            return moves.down
         }
      case moves.left:
         if (cell === '-') {
            return moves.left
         } else if (cell === 'L') {
            return moves.up
         } else if (cell === 'F') {
            return moves.down
         }
   }
}

const connections = {
   // North-South connection pipe
   '|': {
      up: ['F', '7', '|'],
      down: ['|', 'L', 'J'],
      left: [],
      right: [],
   },
   // East-West connection pipe
   '-': {
      up: [],
      down: [],
      left: ['-', 'L', 'F'],
      right: ['-', 'J', '7'],
   },
   // North-East connection pipe
   L: {
      up: ['F', '7', '|'],
      down: [],
      left: [],
      right: ['-', 'J', '7'],
   },
   // North-West connection pipe
   J: {
      up: ['F', '7', '|'],
      down: [],
      left: ['-', 'L', 'F'],
      right: [],
   },
   // South-West connection pipe
   7: {
      up: [],
      down: ['|', 'L', 'J'],
      left: ['-', 'L', 'F'],
      right: [],
   },
   // South-East connection pipe
   F: {
      up: [],
      down: ['|', 'L', 'J'],
      left: [],
      right: ['-', 'J', '7'],
   },
   // Starting pipe
   S: {
      up: ['|', '7', 'F'],
      down: ['|', 'L', 'J'],
      left: ['-', 'L', 'F'],
      right: ['-', 'J', '7'],
   },
   // Empty field
   '.': {
      up: [],
      down: [],
      left: [],
      right: [],
   },
}

const traverse = (start, direction, grid, rows, columns, connections) => {
   const path = [start]

   let currentCell = start
   let currentMove = direction

   while (true) {
      const currentX = currentCell.x
      const nextX =
         currentMove === moves.right
            ? currentX + 1
            : currentMove === moves.left
            ? currentX - 1
            : currentX
      if (nextX > columns - 1 || nextX < 0) {
         break
      }

      const currentY = currentCell.y
      const nextY =
         currentMove === moves.up
            ? currentY - 1
            : currentMove === moves.down
            ? currentY + 1
            : currentY
      if (nextY > rows - 1 || nextY < 0) {
         break
      }

      const nextPipe = grid[nextY][nextX]

      if (nextPipe === 'S') {
         path.push({ pipe: 'S', x: nextX, y: nextY })
         break
      }

      if (connections[currentCell.pipe][currentMove].includes(nextPipe)) {
         const nextCell = { pipe: nextPipe, x: nextX, y: nextY }
         path.push(nextCell)
         currentCell = { ...nextCell }
         currentMove = getNextMove(currentMove, nextCell.pipe)
         if (currentMove === undefined) {
            break
         }
      } else {
         break
      }
   }

   return path
}

const topPath = traverse(
   findStartCell(grid),
   moves.up,
   grid,
   rows,
   columns,
   connections
)

const rightPath = traverse(
   findStartCell(grid),
   moves.right,
   grid,
   rows,
   columns,
   connections
)

const bottomPath = traverse(
   findStartCell(grid),
   moves.down,
   grid,
   rows,
   columns,
   connections
)

const leftPath = traverse(
   findStartCell(grid),
   moves.left,
   grid,
   rows,
   columns,
   connections
)

const getLongestLoop = (paths) => {
   let longestLoop

   paths.forEach((path) => {
      if (path.length > 1 && path.at(0).pipe === path.at(-1).pipe) {
         if (!longestLoop) {
            longestLoop = path
         } else if (longestLoop.length < path.length) {
            longestLoop = path
         }
      }
   })

   return longestLoop
}

const loop = getLongestLoop([topPath, leftPath, bottomPath, rightPath])

const result = (loop.length - 1) / 2

console.log('The result is:', result)
