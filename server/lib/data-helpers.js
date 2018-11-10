"use strict";

// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      db.collection("tweets")
        .insertOne(newTweet)
        .catch(console.log);
      callback(null, true);
    },

    // Get all tweets in `db`
    getTweets: function (callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    },

    // GET @ session:
    // 1. get list of users
    // 2. check if users exists searching on username and a secondary check for password
    // 3. upon successful validation, set cookie on client
    getUsers: function (callback) {
      db.collection("users").find().toArray((err, users) => {
        if (err) {
          return callback(err);
        }
        callback(null, users);
      });
    }
  };
}
