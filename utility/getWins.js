const fs = require('fs');
const { fetchWins } = require('../services/fetchWins');

function getWins(userName, fileName = 'players.json') {
  const playerData = JSON.parse(fs.readFileSync(fileName));

  return fetchWins(userName, playerData);
}

module.exports = { getWins }