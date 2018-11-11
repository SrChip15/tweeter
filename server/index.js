"use strict";

// Basic express setup:
const PORT = 8080;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";
const {MongoClient} = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  // The `data-helpers` module provides an interface
  // to the database of tweets => exports a function that expects the `db` as a parameter
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // `DataHelpers` object contains routes that interacts with the data layer
  // Pass`DataHelpers` object =>`tweets-routes` module
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const userRoutes = require('./routes/users')(DataHelpers);


  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);
  app.use("/session", userRoutes);
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

/* app.post('/session', (req, res) => {
  if (!req.body.name || !req.body.password) {
    res.status(400).send("Username/email or Password field cannot be empty");
  }

  // verify credentials
  let user = users.verify(req.body.name, req.body.password);

  if (user) {
    req.session[COOKIE_NAME] =  user.name; // sets session cookie
    res.redirect('/tweets');
  } else {
    // new user
    res.status(403).statusMessage("Please click the register button");
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
}); */
