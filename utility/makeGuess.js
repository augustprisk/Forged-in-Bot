const { writeDb } = require('../services/dbFunctions')
const fs = require('fs')

function makeGuess(userName, contestantName, season, episode, dbPath = './test.json') {
    const playerData = JSON.parse(fs.readFileSync(dbPath));

    writeDb(userName, contestantName, season, episode, playerData)
}

module.exports = { makeGuess }
