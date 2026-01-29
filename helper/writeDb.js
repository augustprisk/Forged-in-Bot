const fs = require('fs');

async function writeDb(fileName = 'players.json', data) {
    try {
        await fs.promises.writeFile(fileName, JSON.stringify(data));
        return console.log('Save successful');
    } catch(err) {
        return console.log(`Save Failed: ${err}`);
    }
}

module.exports = { writeDb }