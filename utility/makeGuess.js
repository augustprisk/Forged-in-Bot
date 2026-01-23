const { writeDb } = require('../services/guessToDb')
const { readDb } = require('../services/readDb')

function makeGuess(userName, contestantName, season, episode, fileName = 'players.json') {
    const playerData = readDb(fileName)

    writeDb(userName, contestantName, season, episode, playerData)
}

module.exports = { makeGuess }
