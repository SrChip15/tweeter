"use strict";

const userHelper    = require("../lib/util/user-helper")
const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.put("/update/:likeCount", function(req, res) {
    DataHelpers.updateTweet(req.body.tweet_text, req.params.likeCount, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send("Success, record updated!");
      }
    })
  });

  tweetsRoutes.post("/:userhandle", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user =
    req.body.user ? req.body.user : userHelper.generateRandomUser(req.params.userhandle);
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0,
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json(tweet);
      }
    });
  });

  return tweetsRoutes;

}
