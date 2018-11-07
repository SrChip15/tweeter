"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      // db.tweets.push(newTweet);

      db.collection("tweets")
      .insertOne(newTweet)
      .catch(console.log);

      db.close();
      callback(null, true);
      // .then(() => {
      //   console.log("Inserting record...");
      //   return callback(null, true);
      // })
      // .catch(err => {
      //   console.log(err);
      // });

    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {
      // const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      // callback(null, db.tweets.sort(sortNewestFirst));
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    }
  };
}
