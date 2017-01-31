'use strict';

const path = require('path');


module.exports = app => {
	const nconf = require('nconf');

  nconf.argv().env().file(path.join(__dirname, '/env/livestarter.config.json'));

  if (!nconf.get('REDIS_PORT')) {
    nconf.set('REDIS_PORT', '6379');
  }

  if (!nconf.get('REDIS_HOST')) {
    nconf.set('REDIS_HOST', 'localhost');
  }

  if (!nconf.get('MONGO_DB')) {
    // nconf.set('MONGO_DB', 'mongodb://localhost/livestarter');
    nconf.set('MONGO_DB', 'mongodb://maxie:livestarter2017@ds061355.mlab.com:61355/livestarter');
  }

  app.set('nconf', nconf);
};
