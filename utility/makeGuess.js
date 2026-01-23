const { guessToDb } = require('../services/guessToDb')
const { readDb } = require('../helper/readDb')

function makeGuess(userName, contestantName, season, episode, fileName = 'players.json') {
    const data = readDb(fileName)

    guessToDb(userName, contestantName, season, episode, data)
}

module.exports = { makeGuess }
