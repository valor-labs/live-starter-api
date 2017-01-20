'use strict';
const async = require('async');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Countries = mongoose.model('Countries');
const Cities = mongoose.model('Cities');
module.exports = (app) => {
    app.post('/signup', signUpUser);
    app.post('/signup/check-email', isEmailExist);
    app.get('/signup/get-locations', getLocations);
};
function signUpUser(req, res) {
    const query = req.body;
    if (query.username.length === 0) {
        query.username = query.email;
    }
    let newUser = new Users(query);
    newUser.save();
    return res.json({ success: true, data: 'user saved', error: null });
}
function getLocations(req, res) {
    // return (req: any, res: any): Promise<any> | any => {
    async.parallel({
        getCountries: getCountries,
        getCities: getCities
    }, (err, results) => {
        if (err) {
            console.log('error');
            return res.json({ success: !err, msg: [], data: results, error: err });
        }
        console.log('dfsdfsfsdfsdf');
        return res.json({ success: !err, msg: [], data: results, error: err });
    });
    // }
}
function isEmailExist(req, res) {
    const query = req.body;
    if (!query.email || !query.password) {
        return res.json({ success: false, data: null, error: 'Data invalid. Please check required fields.' });
    }
    Users
        .find({ email: query.email })
        .exec((dbError, data) => {
        const userCreateError = 'This email already used.';
        if (dbError) {
            console.log(dbError);
            return res.json({ success: !dbError, data: null, error: dbError });
        }
        if (data.length !== 0) {
            return res.json({ success: !dbError, data: null, error: userCreateError });
        }
        return res.json({ success: !dbError, data: data, error: dbError });
    });
}
function getCountries(cb) {
    return Countries
        .find({})
        .lean()
        .exec((err, data) => {
        if (err) {
            return cb(err);
        }
        return cb(null, data);
    });
}
function getCities(cb) {
    return Cities
        .find({})
        .lean()
        .exec(cb);
}
