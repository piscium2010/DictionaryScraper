const test = require('./testwords');
const db = require('./db');
const br = require('./breakwords');

//test
(async () => {
    let words = br.breakwords(test.wII)
    //words = _.uniq(words)
    for (let i = 0; i < words.length; i++) {
        let w = words[i]
        let document = { word: w.toLowerCase(), status: 0 }
        let id = { word: w.toLowerCase() }
        await db.upSert('words', document, id, false/* autoClose */)
    }
    db.close()
})()
