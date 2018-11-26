var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');
var db = require('mongodb').Db
var user = encodeURIComponent('test');
var password = encodeURIComponent('test');
var authMechanism = 'DEFAULT';

// Connection URL
var url = f('mongodb://%s:%s@localhost:27017/test?authMechanism=%s',
  user, password, authMechanism);

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server")

  db.close();
});

function _insert(collectionName, document) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var testDb = db.db('test')
    let collection = testDb.collection(collectionName)
    collection.insert(document)
    db.close();
  });
}

function insert(collection, document) {
  _insert(collection, document)
}

module.exports = {
  insert
}