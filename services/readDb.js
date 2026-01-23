const fs = require('fs')

function readDb(fileName) {
  return JSON.parse(fs.readFileSync(fileName))
}

module.exports = { readDb }