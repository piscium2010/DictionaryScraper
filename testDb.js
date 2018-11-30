const db = require('./db')

console.log(`db`, db)

db.upSert('words', { word: 'test' }, { word: 'test' })