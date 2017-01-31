'use strict';

import mongoose = require('mongoose');

module.exports = app => {
  const nconf = app.get('nconf');
  const mongoUri = nconf.get('MONGO_DB');
  const db = mongoose.connection;

	mongoose.Promise = global.Promise;
  mongoose.connect(mongoUri);

  /*eslint-disable*/
  db.on('error', err => console.log('db connect error', err));
  db.once('open', () => console.log('db connect good: ', mongoUri));
  db.once('close', () => console.log('db connect close'));
  /*eslint-enable*/
};