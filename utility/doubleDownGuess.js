const { readDb } = require('../helper/readDb.js');
const { writeDoubleDown } = require('../services/writeDoubleDown.js');

function doubleDownGuess(userName, contestant, fileName = 'players.json') {
   data = readDb(fileName)

   writeDoubleDown(userName, contestant, data);
}

module.exports = { doubleDownGuess }