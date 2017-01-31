'use strict';
module.exports = (app) => {
    require('./config')(app);
    require('./express.config')(app);
    require('./db.config')(app);
};
