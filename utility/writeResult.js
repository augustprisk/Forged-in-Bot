const { readDb } = require('../services/readDb');
const { writeDb } = require('../services/resultToDb');

function writeResult(userName, result, weapon, point, fileName = 'players.json') {
  const playerData = readDb(fileName);

  writeDb(userName, result, weapon, point, playerData);
}

module.exports = { writeResult }