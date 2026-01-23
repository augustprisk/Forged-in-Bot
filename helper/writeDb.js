const fs = require('fs');

function writeDb(data) {
    try {
        fs.writeFileSync('players.json', JSON.stringify(data));
        return console.log('Save successful');
    } catch(err) {
        return console.log(`Save Failed: ${err}`);
    }
}

module.exports = { writeDb }