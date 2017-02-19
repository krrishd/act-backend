'use strict';

const express = require('express');
const app = express();

const cors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

app.configure(() => {
  app.use(cors);  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

const mongoose = require('mongoose');
const DB_URL = process.env.MONGO_URI || require('./config').mongo_uri;
mongoose.connect(DB_URL);

const shortid = require('shortid');

const CauseSchema = mongoose.Schema({
  description: String,
  actions: [
    {
      description: String,
      link: String
    }
  ],
  shortId: {
    type: String,
    unique: true,
    'default': shortid.generate
  }
});

const Cause = mongoose.model('cause', CauseSchema);

app.post('/api/new-cause', (req, res) => {
  // adding a new cause, with links/action items
  Cause
    .create({
      description: req.body.description,
      actions: req.body.actions
    }, (error, newCause) => {
      if (error) {
        res.status(500);
        res.json(error);
      }
      res.json(newCause);
    });
});

app.get('/api/cause/:id', (req, res) => {
  // getting the data of a certain cause via its id
  Cause
      .find({
        shortId: req.params.id
      })
      .exec((error, matchingCause) => {
        if (error) {
          res.status(500);
          res.json(error);
        }
        res.json(matchingCause);
      });
});

const port = process.env.PORT || 1776;
app.listen(port);

console.log(`Server listening on ${port}`);
