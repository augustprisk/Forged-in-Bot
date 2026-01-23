const { readDb } = require('../helper/readDb');
const { fetchWins } = require('../services/fetchWins');

function getWins(userName, fileName = 'players.json') {
  const data = readDb(fileName);

  return fetchWins(userName, data);
}

module.exports = { getWins }