const db = require('./db');

//console.log(`db`, db)

//db.upSert('words', { word: 'test' }, { word: 'test' })

// db.find('words', {status:0}, false)
// .then(cursor => cursor.toArray()
// ).then(r => {
//     console.log(`r`,r)
//     db.close()
// })

(async function(){
    const cursor = await db.find('words', {status:0}, false /**auto close */)
    const words = await cursor.toArray()
    console.log(`words`,words)
    db.close()
})()
