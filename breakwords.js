const test = require('./testwords')
const db = require('./db')

function breakwords(str) {
    const wordRegex = /\w{1,}/g
    const words = str.match(wordRegex)
    return words
}

(async () => {
    let words = breakwords(test.words)
    for (let i = 0; i < words.length; i++) {
        let w = words[i]
        let document = { word: w.toLowerCase() }
        let id = { word: w.toLowerCase() }
        await db.upSert('words', document, id, false/* autoClose */)
    }
    db.close()
})()