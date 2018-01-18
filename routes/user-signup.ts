/* tslint:disable:no-any */

import * as async from 'async';
import * as mongoose from 'mongoose';
import { Request, Response, Express } from 'express';
import { User, UserResponse } from '../models/users';
import { Event } from '../models/events';

const users = mongoose.model('Users');
const events = mongoose.model('Events');

const countries = mongoose.model('Countries');
const cities = mongoose.model('Cities');

module.exports = (app: Express): void => {
  app.get('/signup/get-locations', getLocations);
  app.get('/edit-profile/get-user-data', getUserData);
  app.post('/signup', signUpUser);
  app.post('/get-user', getUserData);
  app.get('/get-user-followings', getUserFollowings);
  app.post('/signup/check-email', isEmailExist);
  app.post('/edit-profile/edit-user-data', editUser);
  app.post('/edit-profile/edit-user-avatar', editUserAvatar);
};

export interface GetUserDataInterface {
  email?: string;
  _id?: string;
}

interface EditUserAvatarInterface {
  email: string;
  newAvatarLink: string;
}

function getUserData(req: Request, res: Response): void | undefined {
  const query: GetUserDataInterface = req.query;

  if (!query.email && !query._id) {
    res.json({success: false, data: 'user data failed', error: 'User has no email.'}); // need rework resp obj

    return undefined;
  }

  getUser({query, limit: 1})
    .then(usr => {
      res.json({success: true, data: usr, error: null}); // need rework resp obj
    }).catch(err => {
      const status = 500;
      res.status(status).send(err);
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
        followings: []
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

async function getUserFollowings(req: Request, res: Response): Promise<void | undefined> {
  const query = req.query;

  if (!query.follower) {
    const status = 500;
    res.status(status).send({message: 'follower id is empty. Update without thats prohibited.'});

    return undefined;
  }

  try {
    const currentUser: UserResponse = await getUser({query: {_id: query.follower}, limit: 1}, false) as UserResponse;
    const followings = currentUser.statistics.followings;
    const usrs = await getUser({query: {_id: {$in: followings}}}) as User[];
    const eventParams = {
      query: {creator: {$in: followings}, datePerformance: {$gt: new Date()}},
      sort: 'datePerformance'
    };
    const shows = await getEvent(eventParams) as Event[];
    const responseObj = shows.map(show => {
      const userIndex = usrs.findIndex(user => show.creator === user._id.toString());

      return {
        user: usrs[userIndex],
        show
      };
    });

    res.json(responseObj);
  } catch (err) {
    const status = 500;
    res.status(status).send(err);
  }
}

export function getUser(params: {[key: string]: any}, isTransform = true)
  : Promise<UserResponse[] | UserResponse | User | User[]> {
  const projection = params.projection ? params.projection : {};

  return users
    .find(params.query, projection)
    .lean(true)
    .limit(params.limit)
    .exec()
    .then((usrs: User[]) => {
      if (!isTransform) {
        return params.limit === 1 ? usrs[0] : usrs;
      }

      const parsedUsers =  usrs.map(user => {
        return {
          ...user,
          statistics: {
            followers: user.statistics.followers.length,
            followings: user.statistics.followings.length,
            viewers: user.statistics.viewers.length,
            likes: {
              likeShow: user.statistics.likes.likeShow.length,
              likeUser: user.statistics.likes.likeUser.length,
              liked: user.statistics.likes.liked.length
            }
          },
          shows: {
            owned: user.shows.owned.length,
            purchased: user.shows.purchased.length
          }
        };
      });

      return params.limit === 1 ? parsedUsers[0] : parsedUsers;
    });
}

export function getEvent(params: {[key: string]: any}, isTransform = true): Promise<Event | Event[]> {
  const projection = params.projection ? {...params.projection, ...{buyers: false}} : {buyers: false};

  return events
    .find(params.query, projection)
    .sort(params.sort)
    .limit(params.limit)
    .lean(true)
    .exec()
    .then((shows: Event[]) => {
      if (!isTransform) {
        return params.limit === 1 ? shows[0] : shows;
      }

      const parsedShows =  shows.map(show => {
        return {
        ...show,
          statistics: {
            followers: show.statistics.followers.length,
              viewers: show.statistics.viewers.length,
              likes: show.statistics.likes.length
          }
        };
      });

      return params.limit === 1 ? parsedShows[0] : parsedShows;
    });
}
