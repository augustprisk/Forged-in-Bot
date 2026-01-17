const { writeDb } = require('../services/guessToDb')
const fs = require('fs')

function makeGuess(userName, contestantName, season, episode, dbPath = 'players.json') {
    const playerData = JSON.parse(fs.readFileSync(dbPath));

    writeDb(userName, contestantName, season, episode, playerData)
}

module.exports = { makeGuess }
