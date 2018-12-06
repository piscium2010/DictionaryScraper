const test = require('./testwords')
const db = require('./db')
const _ = require('lodash')

function breakwords(str) {
    let wordRegex = /[a-z]{1,}/g
    let words = str.match(wordRegex)
    words = _.uniq(words)
    return words
}

//test
// (async () => {
//     let words = breakwords(test.words)
//     //words = _.uniq(words)
//     for (let i = 0; i < words.length; i++) {
//         let w = words[i]
//         let document = { word: w.toLowerCase() }
//         let id = { word: w.toLowerCase() }
//         //await db.upSert('words', document, id, false/* autoClose */)
//         console.log(w)
//     }
//     db.close()
// })()

module.exports = {
    breakwords
}