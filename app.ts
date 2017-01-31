'use strict';

// const mongoose = require('mongoose');
const express = require('express');

const app = express();

// mongoose.Promise = Promise;

require('./config')(app);
require('./models')(app);
require('./routes')(app);

const nconf = app.get('nconf');

app.listen(nconf.get('PORT') || nconf.get('DEFAULT_PORT'));