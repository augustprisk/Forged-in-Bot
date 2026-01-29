const { writeDb } = require('../helper/writeDb')

function writeDoubleDown(userName, contestant, data, fileName = 'players.json') {
  guess = data.Players[userName].guesses.at(-1);

  guess.secondGuess = contestant;

  writeDb(fileName, data)
}

module.exports = { writeDoubleDown }