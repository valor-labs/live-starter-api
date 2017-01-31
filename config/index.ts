import { Express }  from 'express';
import { AppConfig } from './app.config';
import { ExpressConfig } from './express.config';
import { DbConfig } from './db.config';

export class Config {
  public constructor(app: Express) {
    new AppConfig(app);
    new ExpressConfig(app);
    new DbConfig(app);
  }
}
