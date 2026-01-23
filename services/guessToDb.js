const { writeDb } = require('../helper/writeDb')

function guessToDb(userName, contestantName, season, episode, data) {
    const player = playerData

    data.Players[userName].guesses.push(
        {
            season: season,
            episode: episode,
            contestant: contestantName,
            result: null,
            finalWeapon: null,
        }
    )

    writeDb(data)
}

module.exports = { guessToDb }