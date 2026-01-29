const { readDb } = require('../helper/readDb')

async function getPoints(userName, fileName = 'players.json') {
  const data = await readDb(fileName);
  const points = data.Players[userName].points;

  return points
}

module.exports = { getPoints }