const fs = require('fs')

function writeResult(result, weapon, point) {
  playersData = JSON.parses(fs.readFileSync('players.json'))
}

module.exports = { writeResult }