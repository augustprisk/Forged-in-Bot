const { readDb } = require('../helper/readDb');
const { resultToDb } = require('../services/resultToDb');

async function writeResult(userName, winner, weapon, point, fileName = 'players.json') {
  const data = await readDb(fileName);

  await resultToDb(userName, result, winner, weapon, point, data, fileName);
}

module.exports = { writeResult }