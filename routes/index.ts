'use strict';

module.exports = (app) => {
  require('./music-styles')(app);
  require('./user-login')(app);
  require('./user-signup')(app);
};
