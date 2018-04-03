/* tslint:disable:no-any */
import { Request, Response, Express } from 'express';

import { User, UserResponse } from '../models/users';
import { getEvent, transformEventToResponceObj } from '../servises/events.service';
import {
  createUser,
  createUserNotification,
  getUser,
  transformUsersToResponceObj,
  updateUser
} from '../servises/users.service';
import { UpdateModel } from '../servises/update.interface';
import { HttpStatus } from '../enums/http-status';

module.exports = (app: Express): void => {
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
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'user email or user id is empty'});

    return undefined;
  }

  getUser({query, limit: 1})
    .then(user => {
      const responseObj = transformUsersToResponceObj(user)[0];
      res.json(responseObj);
    }).catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  });
}

function editUser(req: Request, res: Response): void | undefined {
  const body = req.body;
  const userUpdateSet = body.userUpdateSet;

  if (!body.email) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'user email is empty'});

    return undefined;
  }

  const updateParams: UpdateModel = {
    conditions: {email: body.email},
    doc: {
      $set: userUpdateSet
    }
  };

  updateUser(updateParams)
    .then(() => {
      res.json({message: 'user updated'});
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

function editUserAvatar(req: Request, res: Response): void | undefined {
  const body: EditUserAvatarInterface = req.body;

  if (!body.email) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'user email is empty'});

    return undefined;
  }

  const updateParams: UpdateModel = {
    conditions: {email: body.email},
    doc: {
      $set: {
        avatar: body.newAvatarLink
      }
    }
  };

  updateUser(updateParams)
    .then(() => {
      res.json({message: 'user updated'});
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

async function signUpUser(req: Request, res: Response): Promise<void> {
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

  try {
    const newUser = await createUser(body);
    const newUsersNotification = await createUserNotification(newUser._id);

    res.json(newUser);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }

}

function isEmailExist(req: Request, res: Response): void | undefined {
  const body: GetUserDataInterface = req.body;

  if (!body.email) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Data invalid. Please check required fields'});

    return undefined;
  }

  getUser({query: {email: body.email}, limit: 1})
    .then(users => {
      const respObj = {
        isAlreadyExist: !!users.length,
        message: users.length ? 'This email already used.' : 'This email not used.'
      };

      res.json(respObj);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

async function getUserFollowings(req: Request, res: Response): Promise<void | undefined> {
  const query = req.query;

  if (!query.follower) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({message: 'follower id is empty. Update without thats prohibited.'});

    return undefined;
  }

  try {
    const currentUser: User[] = await getUser({query: {_id: query.follower}, limit: 1});
    const followings = currentUser[0].statistics.followings;
    const usrs: User[] = await getUser({query: {_id: {$in: followings}}});
    const tranformedUser: UserResponse[] = transformUsersToResponceObj(usrs);
    const eventParams = {
      query: {creator: {$in: followings}, datePerformance: {$gt: new Date()}},
      sort: 'datePerformance'
    };
    const shows = await getEvent(eventParams);
    const transformedShows = transformEventToResponceObj(shows, query.follower);
    const responseObj = transformedShows.map(show => {
      const userIndex = tranformedUser.findIndex(user => show.creator === user._id.toString());

      return {
        user: tranformedUser[userIndex],
        show
      };
    });

    res.json(responseObj);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}
