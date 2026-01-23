const { readDb } = require('../services/readDb')

function getPoints(userName, fileName = 'players.json') {
  const playerData = readDb(fileName);
  const points = playerData.Players[userName].points;

  return points
}

module.exports = { getPoints }