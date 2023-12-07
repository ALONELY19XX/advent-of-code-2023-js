import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// Dirname under usage of ES6 modules in node
const __dirname = dirname(fileURLToPath(import.meta.url))

// Read entire input file as string
const input = readFileSync(join(__dirname, 'input.txt')).toString()

// Separate different sections by "<text>:"
const sections = input.split(/[A-Za-z\s-]+:/).filter((part) => part.length)

// Extract seed IDs
const seeds = sections[0]
   .trim()
   .split(' ')
   .map((seed) => parseInt(seed))

// Function to take rows of sections and create mapping group
// For each row of form "<destRangeStart> <srcRangeStart> <range>"
// create group (array) of given values as numbers
// output: Collection of [<destRangeStartAsInt>, <srcRangeStartAsInt>, <rangeAsInt>] triplets
const createMappingGroups = (rows) => {
   const groups = []
   rows.forEach((row) => {
      const [destRangeStart, srcRangeStart, range] = row.split(' ')
      groups.push([
         parseInt(destRangeStart),
         parseInt(srcRangeStart),
         parseInt(range),
      ])
   })
   return groups
}

// Create mapping groups for each section
const seedToSoil = createMappingGroups(sections[1].split('\n'))

const soilToFertilizer = createMappingGroups(sections[2].split('\n'))

const fertilizerToWater = createMappingGroups(sections[3].split('\n'))

const waterToLight = createMappingGroups(sections[4].split('\n'))

const lightToTemperature = createMappingGroups(sections[5].split('\n'))

const temperatureToHumidity = createMappingGroups(sections[6].split('\n'))

const humidityToLocation = createMappingGroups(sections[7].split('\n'))

// Function factory with closures to iterate over every mapping group
// and check if input ID does fit into range of given mapping group
const createIdMapper = (mappings) => {
   return (inputId) => {
      let outputId = inputId

      for (let i = 0; i < mappings.length; ++i) {
         const destRangeStart = mappings[i][0]
         const srcRangeStart = mappings[i][1]
         const range = mappings[i][2]
         if (inputId >= srcRangeStart && inputId < srcRangeStart + range) {
            const offset = inputId - srcRangeStart
            outputId = destRangeStart + offset
            break
         }
      }

      return outputId
   }
}

// Create Mapping functions
const mapSeedToSoil = createIdMapper(seedToSoil)
const mapSoilToFertilizer = createIdMapper(soilToFertilizer)
const mapFertilizerToWater = createIdMapper(fertilizerToWater)
const mapWaterToLight = createIdMapper(waterToLight)
const mapLightToTemperature = createIdMapper(lightToTemperature)
const mapTemperatureToHumidity = createIdMapper(temperatureToHumidity)
const mapHumidityToLocation = createIdMapper(humidityToLocation)

// Array of final location IDs
const locations = []

// For each seed ID find the destination location ID
seeds.forEach((seedId) => {
   const soilId = mapSeedToSoil(seedId)
   const fertilizerId = mapSoilToFertilizer(soilId)
   const waterId = mapFertilizerToWater(fertilizerId)
   const lightId = mapWaterToLight(waterId)
   const temperatureId = mapLightToTemperature(lightId)
   const humidityId = mapTemperatureToHumidity(temperatureId)
   const locationId = mapHumidityToLocation(humidityId)
   locations.push(locationId)
})

// Get result
const result = Math.min(...locations)

console.log('The result is:', result)
