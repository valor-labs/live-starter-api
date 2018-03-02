import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { Express } from 'express';

// export const CLIENT_URL = 'http://localhost:4200';
export const CLIENT_URL = 'https://livestarter-c828d.firebaseapp.com';

export class ExpressConfig {
  constructor(app: Express) {
    const corsOptions = {
      origin: CLIENT_URL,
      credentials: true
    };

    app.use(logger('dev'));
    app.use(cors(corsOptions));
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
  }
}
