const { guessToDb } = require('../services/guessToDb')
const { readDb } = require('../helper/readDb')

async function makeGuess(userName, contestantName, season, episode, fileName = 'players.json') {
    const data = await readDb(fileName)

    await guessToDb(userName, contestantName, season, episode, data, fileName)
}

module.exports = { makeGuess }
