import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { Express } from 'express';

export class ExpressConfig {
  constructor(app: Express) {
    const url = 'https://livestarter-c828d.firebaseapp.com';
    // const url = 'http://localhost:4200';

    const corsOptions = {
      origin: url,
      credentials: true
    };

    app.use(logger('dev'));
    app.use(cors(corsOptions));
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
  }
}
