const { writeDb } = require('../helper/writeDb')

function guessToDb(userName, contestantName, season, episode, data, fileName = 'players.json') {
    data.Players[userName].guesses.push(
        {
            season: season,
            episode: episode,
            contestant: contestantName,
            result: null,
            finalWeapon: null,
        }
    )

    writeDb(fileName, data)
}

module.exports = { guessToDb }