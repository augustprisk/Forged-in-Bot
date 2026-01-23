const fs = require('fs')

function writeDb(userName, contestantName, season, episode, playerData) {
    const player = playerData

    playerData.Players[userName].guesses.push(
        {
            season: season,
            episode: episode,
            contestant: contestantName,
            result: null,
            finalWeapon: null,
        }
    )

    try {
        fs.writeFileSync('players.json', JSON.stringify(playerData))
        return console.log('Save successful')
    } catch(err) {
        return console.log(`Save Failed: ${err}`)
    }
}

module.exports = { writeDb }