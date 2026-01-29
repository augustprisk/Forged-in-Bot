const fs = require('fs')

async function readDb(fileName) {
  const data = await fs.promises.readFile(fileName)
  return JSON.parse(data)
}

module.exports = { readDb }