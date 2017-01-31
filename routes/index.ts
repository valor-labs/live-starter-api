import { Express }  from 'express';

export class Routes {
  public constructor(app: Express) {
    require('./search-filters')(app);
    require('./user-signup')(app);
    require('./faq')(app);
    require('./event')(app);
  }
}
