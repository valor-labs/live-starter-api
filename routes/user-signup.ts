import * as async from 'async';
import * as mongoose from 'mongoose';
import { Request, Express }  from 'express';

const Users: any = mongoose.model('Users');
const Countries: any = mongoose.model('Countries');
const Cities: any = mongoose.model('Cities');

module.exports = (app: Express): void => {
  app.get('/signup/get-locations', getLocations);
  app.get('/edit-profile/get-user-data', getUserData);
  app.post('/signup', signUpUser);
  app.post('/signup/check-email', isEmailExist);
  app.post('/edit-profile/edit-user-data', editUser);
};

interface GetUserDataInterface {
  email: string;
}

interface EditUserDataInterface {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
}

function getUserData(req: Request, res: any): Promise<any> | Function {
  const query: GetUserDataInterface = req.query;

  if (!query.email) {
    return res.json({success: false, data: 'user data failed', error: 'User has no email.'});
  }

  return Users
    .findOne({email: query.email})
    .lean(true)
    .exec((err: Error, user: any): Function => {
      return res.json({success: true, data: user, error: err});
    });
}

function editUser(req: Request, res: any): Promise<any> | Function {
  const body: EditUserDataInterface = req.body;

  if (!body.email) {
    return res.json({
      success: false, data: 'user update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });
  }

  return Users
    .update({email: body.email}, {
      $set: {
        firstName: body.firstName,
        lastName: body.lastName,
        country: body.country,
        city: body.city
      }
    })
    .exec((err: Error): Function => {
      return res.json({success: !err, data: 'user updated', error: err});
    });
}

function signUpUser(req: Request, res: any): Promise<any> {
  const body: any = req.body;

  if (body.username.length === 0) {
    body.username = body.email;
  }

  let newUser = new Users(body);

  return newUser.save((err: Error): Function => {
    return res.json({success: !err, data: 'user saved', error: err});
  });
}

function getLocations(req: Request, res: any): void {
  async.parallel({
    getCountries,
    getCities
  }, (err: any, results: {getCountries: any, getCities: any}): Function => {
    return res.json({success: !err, msg: [], data: results, error: err});
  });

}

function isEmailExist(req: Request, res: any): Promise<any> | Function {
  const body: GetUserDataInterface = req.body;

  if (!body.email) {
    return res.json({success: false, data: null, error: 'Data invalid. Please check required fields.'});
  }

  return Users
    .find({email: body.email})
    .lean(true)
    .exec((dbError: Error, data: any): Function => {
      if (dbError) {
        console.log(dbError);
        return res.json({success: !dbError, data: null, error: dbError});
      }

      if (data.length !== 0) {
        const userCreateError = 'This email already used.';
        return res.json({success: !dbError, data: null, error: userCreateError});
      }
      return res.json({success: !dbError, data, error: dbError});
    });
}

function getCountries(cb: Function): Promise<any> {
  return Countries
    .find({})
    .lean(true)
    .exec(cb);
}

function getCities(cb: Function): Promise<any> {
  return Cities
    .find({})
    .lean(true)
    .exec(cb);
}
