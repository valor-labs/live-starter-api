import { Express } from 'express';

export class Routes {
  constructor(app: Express) {
    require('./search-filters')(app);
    require('./user-signup')(app);
    require('./user-statistics')(app);
    require('./users.route')(app);
    require('./faq')(app);
    require('./event')(app);
    require('./appriciations')(app);
    require('./upload-files')(app);
    require('./follow')(app);
    require('./location')(app);
    require('./genres')(app);
  }
}
