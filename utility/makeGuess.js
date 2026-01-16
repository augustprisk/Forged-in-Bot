const { writeDb } = require('../services/dbFunctions')
const fs = require('fs')

function makeGuess(userName, contestantName, episode, dbPath = './players.json') {
    const playerData = JSON.parse(fs.readFileSync(dbPath));

    writeDb(userName, contestantName, episode, playerData)
}

module.exports = { makeGuess }
