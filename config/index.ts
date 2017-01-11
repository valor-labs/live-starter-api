'use strict';

module.exports = (app) => {
  require('./config')(app);
  require('./express.config')(app);
};
