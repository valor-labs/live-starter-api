import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

export class ExpressConfig {
  public constructor(app: any) {
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors());
  }
}
