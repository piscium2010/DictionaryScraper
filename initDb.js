var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');

var user = encodeURIComponent('root');
var password = encodeURIComponent('example');
var authMechanism = 'DEFAULT';

// Connection URL
var url = f('mongodb://%s:%s@localhost:27017/admin?authMechanism=%s',
  user, password, authMechanism);

const options ={
    roles: [{ role: "readWrite", db: "test" }]
}

MongoClient.connect(url, function(err, db) {

  // Use the admin database for the operation
  //console.log(`db`,Object.keys(db))
  var adminDb = db.db('test');

  // Add the new user to the admin database
  adminDb.addUser('test', 'test', options, function(err, result) {
    console.log(`connected`,)
    // Authenticate using the newly added user
    db.close()
  });
});
