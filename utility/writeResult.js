const { readDb } = require('../helper/readDb');
const { resultToDb } = require('../services/resultToDb');

function writeResult(userName, result, weapon, point, fileName = 'players.json') {
  const data = readDb(fileName);

  resultToDb(userName, result, weapon, point, data);
}

module.exports = { writeResult }