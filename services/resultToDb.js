const { writeDb } = require('../helper/writeDb')

function resultToDb(userName, result, weapon, point, data) {
  const player = data.Players[userName];
  const guesses = player.guesses;
  const lastGuess = guesses.at(-1);

  lastGuess.result = result;
  lastGuess.finalWeapon = weapon;

  if ((result === 'lose') && guesses.at(-1).hasOwnProperty('secondGuess')) point = -1;

  (player.points += point) >= 5 && (player.points = 0);

  writeDb(data)
}

module.exports = { resultToDb }