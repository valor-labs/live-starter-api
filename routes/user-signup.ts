'use strict';

import async = require('async');
import mongoose = require('mongoose');
const Users: any = mongoose.model('Users');
const Countries: any = mongoose.model('Countries');
const Cities: any = mongoose.model('Cities');

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
	return res.json({success: true, data: 'user saved', error: null});
}

function getLocations(req, res): any {


	// return (req: any, res: any): Promise<any> | any => {
		async.parallel({
			getCountries: getCountries,
			getCities: getCities
		}, (err: any, results: {getCountries: any, getCities: any}): Function => {
			if (err) {
				console.log('error');
				return res.json({success: !err, msg: [], data: results, error: err});
			}
			console.log('dfsdfsfsdfsdf');
			return res.json({success: !err, msg: [], data: results, error: err});
		});
	// }
}

function isEmailExist(req, res) {
	const query = req.body;

	if (!query.email || !query.password) {
		return res.json({success: false, data: null, error: 'Data invalid. Please check required fields.'});
	}

	Users
		.find({email: query.email})
		.exec((dbError: Error, data: any) => {
			const userCreateError = 'This email already used.';

			if (dbError) {
				console.log(dbError);
				return res.json({success: !dbError, data: null, error: dbError});
			}

			if (data.length !== 0) {
				return res.json({success: !dbError, data: null, error: userCreateError});
			}
			return res.json({success: !dbError, data: data, error: dbError});
		});
}

function getCountries(cb: Function): Promise<any> {
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

function getCities(cb: Function): Promise<any> {
	return Cities
		.find({})
		.lean()
		.exec(cb);
}
