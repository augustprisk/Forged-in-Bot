const fs = require('fs');

function fetchWins(userName, playerData) {
  const wins = playerData.Players[userName].guesses.filter(guess => guess.result === 'win');

  return wins
}

module.exports = { fetchWins }