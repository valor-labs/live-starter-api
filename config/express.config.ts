import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

export class ExpressConfig {
  public constructor(app: any) {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
  }
}