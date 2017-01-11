'use strict';

module.exports = (app) => {
	app.post('/signup', signUpUser);
};

function signUpUser (req, res) {
  const query = req.body;
  console.log('query: ', query);
	if (!query.userEmail || !query.userPassword || !query.userPasswordConfirm) {
		res.json({data: {error: 'Data invalid. Please check required fields.'}});
		return;
	} else {
		let response = {data: {user: query, error: null}};
		res.json(response);
	}
}
