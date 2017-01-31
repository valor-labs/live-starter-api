'use strict';
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
module.exports = (app) => {
    app.post('/login', loginUser);
};
function loginUser(req, res) {
    const query = req.body;
    if (!query.email || !query.pwd) {
        return res.json({ data: null, error: 'Data invalid. Please check required fields.' });
    }
    else {
        Users
            .findOne({ email: query.email })
            .lean()
            .exec((dbError, data) => {
            const userCreateError = 'No such user. Please sign up.';
            const userPwdError = 'Invalid password.';
            if (dbError) {
                return res.json({ success: !dbError, data: null, error: dbError });
            }
            if (!data || data.length === 0) {
                return res.json({ success: !dbError, data: null, error: userCreateError });
            }
            if (query.pwd !== data.password) {
                return res.json({ success: !dbError, data: null, error: userPwdError });
            }
            return res.json({ success: !dbError, data: data, error: dbError });
        });
    }
}
