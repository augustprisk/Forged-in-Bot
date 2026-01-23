const fs = require('fs');

function fetchWins(userName, data) {
  const wins = data.Players[userName].guesses.filter(guess => guess.result === 'win');

  return wins
}

module.exports = { fetchWins }