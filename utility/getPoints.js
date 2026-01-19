const fs = require('fs');

function getPoints(userName) {
  playerData = JSON.parse(fs.readFileSync('players.json'));
  const points = playerData.Players[userName].points

  return points
}

module.exports = { getPoints }