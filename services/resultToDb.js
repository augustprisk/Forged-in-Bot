const fs = require('fs');

function writeDb(userName, result, weapon, point, playerData) {
  const player = playerData.Players[userName]
  const guesses = player.guesses
  const lastGuess = guesses.at(-1);
  const points = player.points

  player.points = points + point
  lastGuess.result = result
  lastGuess.finalWeapon = weapon

  try {
      fs.writeFileSync('players.json', JSON.stringify(playerData))
      return console.log('Save successful')
  } catch(err) {
      return console.log(`Save Failed: ${err}`)
  }
}

module.exports = { writeDb }