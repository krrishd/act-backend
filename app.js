'use strict';

const express = require('express');
const app = express();

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
  _id: {
    type: String,
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
    })
    .exec((error, newCause) => {
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
        _id: req.params.id
      })
      .exec((error, matchingCause) => {
        if (error) {
          res.status(500);
          res.json(error);
        }
        res.json(matchingCause);
      });
});
