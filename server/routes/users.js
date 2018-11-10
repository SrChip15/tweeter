"use strict";

const express = require('express');
const userRoutes = express.Router();

module.exports = function (DataHelpers) {
  // Login route
  userRoutes.get("/", function (req, res) {
    DataHelpers.getUsers((err, users) => {
      if (err) {
        res.status(500).json({
          error: err.message
        });
      } else {
        res.json(users);
      }
    });
  });

  /* userRoutes.post("/", function (req, res) {
    if (!req.body.text) {
      res.status(400).json({
        error: 'invalid request: no data in POST body'
      });
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({
          error: err.message
        });
      } else {
        res.status(201).json(tweet);
      }
    });
  }); */

  return userRoutes;

}