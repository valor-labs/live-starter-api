import { Request, Response, Express } from 'express';

import {
  getUser, getUserNotificationsModel,
  transformUsersToResponceObj,
  updateUser,
  updateUserNotificationsModel
} from '../servises/users.service';
import { UserResponse } from '../models/users';
import { getEvent, transformEventToResponceObj } from '../servises/events.service';
import { UpdateModel } from '../servises/update.interface';
import { HttpStatus } from '../enums/http-status';

module.exports = (app: Express): void => {
  app.get('/get-artists-by-query', getArtistWithNextShow);
  app.get('/get-users-by-query', getUsersByQuery);
  app.get('/get-users-amount', getUsersAmount);
  app.put('/update-user-profile', updateUserProfile);
  app.put('/update-user-notifications', updateUserNotifications);
  app.get('/get-user-notifications', getUserNotifications);
};

interface UsersQueryObj {
  active: boolean;
  withNextShow?: boolean;
  username?: RegExp;
  country?: string;
  type?: string;
  genres?: { $in: string[] };
}

interface UsersRequestQueryObj {
  findByName?: string;
  withNextShow?: boolean;
  findByLocation?: string;
  type?: string;
  findByGenre?: string;
}

function getUsersAmount(req: Request, res: Response): void {
  const query = req.query;

  getUser({query})
    .then(users => {
      res.json(users.length);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

function getUserNotifications(req: Request, res: Response): void | undefined {
  const query = req.query;

  if (!query.userId) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Unidentified user'});

    return undefined;
  }

  const searchParams = {
    query: {userId: query.userId},
    projection: {
      _id: false,
      userId: false,
      __v: false
    }
  };

  getUserNotificationsModel(searchParams)
    .then(notifications => {
      res.json(notifications);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

function parseQuery(query: UsersRequestQueryObj): UsersQueryObj {
  const usersQueryObj: UsersQueryObj = {
    active: true
  };

  if (query.findByName) {
    usersQueryObj.username = new RegExp(query.findByName);
  }

  if (query.findByLocation) {
    usersQueryObj.country = query.findByLocation;
  }

  if (query.findByGenre) {
    usersQueryObj.genres = {$in: query.findByGenre.split(',')};
  }

  return usersQueryObj;
}

async function getUsersByQuery(req: Request, res: Response): Promise<void | undefined> {
  const query = req.query;
  const usersQueryObj: UsersQueryObj = parseQuery(query);
  const limit = query && query.limit ? Number(query.limit) : undefined;

  try {
    const users = await getUser({query: usersQueryObj, limit});
    const tranformedUser: UserResponse[] = transformUsersToResponceObj(users);

    if (!query || !query.withNextShow) {
      res.json(tranformedUser);
    }

    const eventParams = {
      query: {
        datePerformance: {$gt: new Date()}
      },
      sort: { datePerformance: 1, creator: -1}
    };

    const events = await getEvent(eventParams);

    const respObj = tranformedUser.map(user => {
      const userShows = events.filter(event => {
        return event.creator === user._id.toString();
      });

      const tranformedShow = userShows.length ? transformEventToResponceObj([userShows[0]])[0] : null;

      return {
        user,
        show: tranformedShow
      };
    });

    res.json(respObj);

  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

async function getArtistWithNextShow(req: Request, res: Response): Promise<void | undefined> {
  const query = req.query;
  const usersQueryObj: UsersQueryObj = parseQuery(query);

  try {
    const users = await getUser({query: usersQueryObj});
    const tranformedUser: UserResponse[] = transformUsersToResponceObj(users);
    const eventParams = {
      query: {
        datePerformance: {$gt: new Date()}
      },
      sort: { datePerformance: 1, creator: -1}
    };

    const events = await getEvent(eventParams);

    const respObj = tranformedUser.map(user => {
      const userShows = events.filter(event => {
        return event.creator === user._id.toString();
      });

      const tranformedShow = userShows.length ? transformEventToResponceObj([userShows[0]])[0] : null;

      return {
        user,
        show: tranformedShow
      };
    });

    res.json(respObj);

  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

function updateUserProfile(req: Request, res: Response): void | undefined {
  const body = req.body;
  const updatedData = body.updatedData;

  if (!body.id) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Unidentified user'});

    return undefined;
  }

  const updateParams: UpdateModel = {
    conditions: {_id: body.id},
    doc: {
      $set: updatedData
    }
  };

  updateUser(updateParams)
    .then(() => {
      res.json({message: 'Your profile was successfully updated'});
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

function updateUserNotifications(req: Request, res: Response): void | undefined {
  const body = req.body;
  const updatedData = body.updatedData;

  if (!body.id) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Unidentified user'});

    return undefined;
  }

  const updateParams: UpdateModel = {
    conditions: {userId: body.id},
    doc: {
      $set: updatedData
    }
  };

  updateUserNotificationsModel(updateParams)
    .then(() => {
      res.json({message: 'Your Notifications was successfully updated'});
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}
