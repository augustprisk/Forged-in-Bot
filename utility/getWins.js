const { readDb } = require('../helper/readDb');
const { fetchWins } = require('../services/fetchWins');

async function getWins(userName, fileName = 'players.json') {
  const data = await readDb(fileName);

  return fetchWins(userName, data);
}

module.exports = { getWins }