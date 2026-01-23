const fs = require('fs');

function writeDb(userName, result, weapon, point, playerData) {
  const player = playerData.Players[userName];
  const guesses = player.guesses;
  const lastGuess = guesses.at(-1);

  lastGuess.result = result;
  lastGuess.finalWeapon = weapon;

  if ((result === 'lose') && guesses.at(-1).hasOwnProperty('secondGuess')) point = -1;

  (player.points += point) >= 5 && (player.points = 0);

  try {
      fs.writeFileSync('players.json', JSON.stringify(playerData))
      return console.log('Save successful')
  } catch(err) {
      return console.log(`Save Failed: ${err}`)
  }
}

module.exports = { writeDb }