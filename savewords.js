const db = require('./db');

async function saveWords(words) {
  for (let i = 0; i < words.length; i++) {
    let w = words[i]
    let document = { word: w.toLowerCase(), status: 0 }
    let id = { word: w.toLowerCase() }
    await db.upSert('words', document, id, false/* autoClose */)
  }
}

async function close() {
    await db.close()
}

module.exports = {
    saveWords,
    close
}