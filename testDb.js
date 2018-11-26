const db = require('./db')

console.log(`db`,db)

db.insert('words', {word:'world_no_safe'})