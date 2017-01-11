'use strict';
module.exports = (app) => {
    app.post('/login', loginUser);
};
function loginUser(req, res) {
    const query = req.body;
    console.log('query: ', query);
    if (query.email === 'robert.shaw@gmail.com' && query.pwd === '123') {
        let response = { data: { name: 'Robert', lastName: 'Shaw', type: 'musician', error: null } };
        res.json(response);
        return;
    }
    else {
        res.json({ data: { error: 'Email or password invalid.' } });
    }
}
