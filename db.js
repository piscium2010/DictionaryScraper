const MongoClient = require('mongodb').MongoClient
const f = require('util').format
const assert = require('assert')
const db = require('mongodb').Db
const user = encodeURIComponent('test')
const password = encodeURIComponent('test')
const authMechanism = 'DEFAULT'
const url = f('mongodb://%s:%s@localhost:27017/test?authMechanism=%s', user, password, authMechanism)

let mongoDb

function close() {
  if (mongoDb) {
    mongoDb.close()
    console.log(`close`)
  }
}

function withDb(func) {
  let exec = () => {
    const testDb = mongoDb.db('test')
    return func(testDb, close)
  }

  if (mongoDb) {
    console.log(`reuse`)
    return exec()
  } else {
    MongoClient.connect(url, function (err, mongo) {
      console.log(`connect`)
      mongoDb = mongo
      return exec()
    })
  }
}

async function connect() {
  return new Promise((resolve, reject) => {
    if (mongoDb) {
      resolve(mongoDb.db('test'))
    } else {
      MongoClient.connect(url, function (err, mongo) {
        if (err) { reject(err) }
        //console.log(`connect`)
        mongoDb = mongo
        resolve(mongoDb.db('test'))
      })
    }
  })
}

async function upSert(collectionName, document, id, autoClose = true) {
  let db = await connect()

  return new Promise((resolve, reject) => {
    let callback = (err, result) => {
      if (err) { reject(err) }
      //if (autoClose) { close() }
      console.log(`resolve`)
      resolve(result)
    }

    let collection = db.collection(collectionName)
    let batch = collection.initializeOrderedBulkOp()
    batch.find(id).upsert().updateOne({ $set: document })
    batch.execute(callback)

    // collection.findOne(id, function (err, doc) {
    //   if (err) { reject(err) }
    //   // if (doc) {
    //   //   console.log(`document`,doc, document)
    //   //   collection.updateOne(doc, document, callback)
    //   // } else {
    //   //   collection.insertOne(document, callback)
    //   // }
    // })
  })

}

module.exports = {
  upSert,
  close
}