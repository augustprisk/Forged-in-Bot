const fs = require('fs');

function readDb(dbName = 'players.json') {
    const data = fs.readFileSync(dbName, 'utf-8');
    return JSON.parse(data);
}

function writeDb(userName, contestantName, episode, playerData) {
    const player = playerData

    playerData.Players[userName].guesses.push(
        {
            episode: episode,
            contestant: contestantName,
            win: null,
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

module.exports = { readDb, writeDb }