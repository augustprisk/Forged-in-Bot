const fs = require('fs');

function writeDoubleDown(userName, contestant, data) {
  guess = data.Players[userName].guesses.at(-1);

  guess.secondGuess = contestant;

  try {
      fs.writeFileSync('players.json', JSON.stringify(data))
      return console.log('Save successful')
  } catch(err) {
      return console.log(`Save Failed: ${err}`)
  }
}

module.exports = { writeDoubleDown }