import { Config } from './config';
import './models';
import { Routes } from './routes';

// const mongoose = require('mongoose');
const express = require('express');

const app = express();

// mongoose.Promise = Promise;

new Config(app);
new Routes(app);

const nconf = app.get('nconf');

app.listen(nconf.get('PORT') || nconf.get('DEFAULT_PORT'));