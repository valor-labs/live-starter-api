/* tslint:disable:no-any */

import * as async from 'async';
import * as mongoose from 'mongoose';
import { Request, Response, Express } from 'express';
import { User } from '../models/users';

const users = mongoose.model('Users');

const countries = mongoose.model('Countries');
const cities = mongoose.model('Cities');

module.exports = (app: Express): void => {
  app.get('/signup/get-locations', getLocations);
  app.get('/edit-profile/get-user-data', getUserData);
  app.post('/signup', signUpUser);
  app.post('/get-user', getUserData);
  app.post('/signup/check-email', isEmailExist);
  app.post('/edit-profile/edit-user-data', editUser);
  app.post('/edit-profile/edit-user-avatar', editUserAvatar);
};

interface GetUserDataInterface {
  email: string;
}

interface EditUserAvatarInterface {
  email: string;
  newAvatarLink: string;
}

function getUserData(req: Request, res: Response): void | undefined {
  const query: GetUserDataInterface = req.query;

  if (!query.email) {
    res.json({success: false, data: 'user data failed', error: 'User has no email.'});

    return undefined;
  }

  users
    .findOne({email: query.email})
    .lean(true)
    .exec((err: Error, user: User): void => {
      res.json({success: true, data: user, error: err});
    });
}

function editUser(req: Request, res: Response): void | undefined {
  const body = req.body;
  const userUpdateSet = body.userUpdateSet;

  if (!body.email) {
    res.json({
      success: false, data: 'user update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });

    return undefined;
  }

  users
    .update({email: body.email}, {$set: userUpdateSet})
    .exec(err => {
      res.json({success: !err, data: 'user updated', error: err});
    });
}

function editUserAvatar(req: Request, res: Response): void | undefined {
  const body: EditUserAvatarInterface = req.body;

  if (!body.email) {
    res.json({
      success: false, data: 'user update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });

    return undefined;
  }

  users
    .update({email: body.email}, {
      $set: {
        avatar: body.newAvatarLink
      }
    })
    .exec(err => {
      res.json({success: !err, data: 'user updated', error: err});
    });
}

function signUpUser(req: Request, res: Response): void | undefined {
  const body = {
    ...req.body,
    ...{
      statistics: {
        likes: {
          liked: [],
          likeUser: [],
          likeShow: []
        },
        viewers: [],
        followers: [],
        following: []
      },
      shows: {
        owned: [],
        purchased: []
      }
    }
  };
  delete body._id;

  const newUser = new users(body);

  newUser.save((err: Error, user: User): void | undefined => {
    if (err) {
      const status = 500;
      res.status(status).send(err);

      return undefined;
    }

    res.json(user);
  });
}

function getLocations(req: Request, res: Response): void {
  async.parallel({
    getCountries,
    getCities
  }, (err, results: {getCountries: string[], getCities: string[]}): void => {
    res.json({success: !err, msg: [], data: results, error: err});
  });
}

function isEmailExist(req: Request, res: Response): void | undefined {
  const body: GetUserDataInterface = req.body;

  if (!body.email) {
    res.json({success: false, data: null, error: 'Data invalid. Please check required fields.'});

    return undefined;
  }

  users
    .find({email: body.email})
    .lean(true)
    .exec((dbError: Error, data: User[]): void | undefined => {
      if (dbError) {
        res.json({success: !dbError, data: null, error: dbError});

        return undefined;
      }

      if (data.length !== 0) {
        const userCreateError = 'This email already used.';
        res.json({success: true, data: null, error: userCreateError});

        return undefined;
      }

      res.json({success: !dbError, data, error: dbError});
    });
}

function getCountries(cb: Function): Promise<any> {
  return countries
    .find({})
    .lean(true)
    .exec(cb);
}

function getCities(cb: Function): Promise<any> {
  return cities
    .find({})
    .lean(true)
    .exec(cb);
}
