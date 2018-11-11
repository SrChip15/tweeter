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

  userRoutes.post("/", function (req, res) {
    if (!req.body.name && !req.body.password) {
      res.status(400).json({
        error: 'invalid request: no data in POST body'
      });
      return;
    }

    const user = {
      name: req.body.name,
      password: req.body.password,
    };

    DataHelpers.saveUser(user, (err) => {
      if (err) {
        res.status(500).json({
          error: err.message
        });
      } else {
        res.status(201).send("Sucess, new user added!");
      }
    });
  });

  return userRoutes;

}