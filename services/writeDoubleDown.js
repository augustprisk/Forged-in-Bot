const { writeDb } = require('../helper/writeDb')

function writeDoubleDown(userName, contestant, data) {
  guess = data.Players[userName].guesses.at(-1);

  guess.secondGuess = contestant;

  writeDb(data)
}

module.exports = { writeDoubleDown }