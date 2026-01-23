const { readDb } = require('../services/readDb');
const { fetchWins } = require('../services/fetchWins');

function getWins(userName, fileName = 'players.json') {
  const playerData = readDb(fileName);

  return fetchWins(userName, playerData);
}

module.exports = { getWins }