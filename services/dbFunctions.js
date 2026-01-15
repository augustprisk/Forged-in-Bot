const fs = require('fs');

function readDb(dbName = 'players.json') {
    const data = fs.readFileSync(dbName, 'utf-8');
    return JSON.parse(data);
}

function writeDb(obj, dbName = './players.json') {
    const jsonData = JSON.parse(dbName)

    if (!obj) { return console.log('Please provide data to save') }

    jsonData.propertyName = 'new value'
    try {
        fs.writeFileSync(dbName, JSON.stringify(obj))
        return console.log('Save successful')
    } catch(err) {
        return console.log('Save Failed')
    }
}

module.exports = { readDb, writeDb }