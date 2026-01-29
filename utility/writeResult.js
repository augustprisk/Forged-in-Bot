const { readDb } = require('../helper/readDb');
const { resultToDb } = require('../services/resultToDb');

async function writeResult(userName, result, weapon, point, fileName = 'players.json') {
  const data = await readDb(fileName);

  resultToDb(userName, result, weapon, point, data, fileName);
}

module.exports = { writeResult }