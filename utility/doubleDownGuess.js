const { readDb } = require('../helper/readDb.js');
const { writeDoubleDown } = require('../services/writeDoubleDown.js');

async function doubleDownGuess(userName, contestant, fileName = 'players.json') {
   const data = await readDb(fileName)

   await writeDoubleDown(userName, contestant, data, fileName);
}

module.exports = { doubleDownGuess }