const fs = require('fs');

function readDb(dbName = 'players.json') {
    const data = fs.readFileSync(dbName, 'utf-8');
    return JSON.parse(data);
}

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
        fs.writeFileSync('test.json', JSON.stringify(playerData))
        return console.log('Save successful')
    } catch(err) {
        return console.log(`Save Failed: ${err}`)
    }
}

module.exports = { readDb, writeDb }