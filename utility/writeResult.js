const fs = require('fs')
const { writeDb } = require('../services/resultToDb')

function writeResult(userName, result, weapon, point) {
  playerData = JSON.parse(fs.readFileSync('players.json'))

  writeDb(userName, result, weapon, point, playerData)
}

module.exports = { writeResult }