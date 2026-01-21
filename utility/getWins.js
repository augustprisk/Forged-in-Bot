const fs = require('fs');
const { fetchWins } = require('../services/fetchWins');

function getWins(userName) {
  const playerData = JSON.parse(fs.readFileSync('players.json'));

  return fetchWins(userName, playerData);
}

console.log(getWins("Grace"));

module.exports = { getWins }