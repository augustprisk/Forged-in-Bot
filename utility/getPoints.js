const { readDb } = require('../services/readDb')

function getPoints(userName, fileName = 'players.json') {
  const data = readDb(fileName);
  const points = data.Players[userName].points;

  return points
}

module.exports = { getPoints }