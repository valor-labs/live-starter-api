import { Config } from './config';
import './models';
import { Routes } from './routes';
import * as path from 'path';
import * as express from 'express';

// const mongoose = require('mongoose');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// mongoose.Promise = Promise;

new Config(app);
new Routes(app);

const nconf = app.get('nconf');

app.listen(nconf.get('PORT') || nconf.get('DEFAULT_PORT'));