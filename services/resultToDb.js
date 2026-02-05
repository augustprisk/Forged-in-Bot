const { writeDb } = require('../helper/writeDb')

function resultToDb(userName, winner, weapon, point, data, fileName = 'players.json') {
  const player = data.Players[userName];
  const guesses = player.guesses;
  const lastGuess = guesses.at(-1);
  let result = null;

  lastGuess.winner = winner;
  lastGuess.finalWeapon = weapon;

  if (guesses.at(-1).hasOwnProperty('secondGuess')) {
    ((lastGuess.secondGuess === winner)) ? result = "win" : result = "lose"
  } else {
    ((lastGuess.contestant === winner)) ? result = "win" : result = "lose"
  }
  
  lastGuess.result = result

  if ((result === 'lose') && guesses.at(-1).hasOwnProperty('secondGuess')) point = -1;

  (player.points += point) >= 5 && (player.points = 0);

  writeDb(fileName, data)
}

module.exports = { resultToDb }