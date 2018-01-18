/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Request, Express, Response } from 'express';

import { User } from '../models/users';

const users = mongoose.model('Users');

module.exports = (app: Express): void => {
  app.post('/follow-user', followUser);
  app.post('/check-followed', checkFollowed);
};

export interface FollowResponse {
  isFollowed: boolean;
  message?: string;
}

async function followUser(req: Request, res: Response): Promise<void | undefined> {
  const body = req.body;

  if (!body.follower || !body.following) {
    const status = 500;
    res.status(status).send({message: 'follower or followed are absent. Update without thats prohibited.'});

    return undefined;
  }

  try {
    await follow(body);
    await follow(body, false)
      .then(result => {
        res.json(result);
      });
  } catch (error) {
    const status = 500;
    res.status(status).send(error);
  }
}

function follow(query: { follower: string; following: string; }, isFollower = true): Promise<FollowResponse>  {
  const updatingUserId = isFollower ? query.follower : query.following;
  const updatingField =
    isFollower ? {'statistics.followings': query.following} : {'statistics.followers': query.follower};

  return users
    .findOne({_id: updatingUserId})
    .lean(true)
    .exec()
    .then((user: User) => {
      const isUnfollow = isFollower ? user.statistics.followings.includes(query.following) :
        user.statistics.followers.includes(query.follower);

      if (isUnfollow) {
        return users
          .update(
            {_id: updatingUserId},
            {$pull: updatingField})
          .then(() => ({isFollowed: false, message: `You have stopped following ${user.username}`}));
      }

      return users
        .update(
          {_id: updatingUserId},
          {$push: updatingField})
        .then(() => ({isFollowed: true, message: `You have started following ${user.username}`}));
    });
}

function checkFollowed(req: Request, res: Response): void | undefined {
  const body = req.body;

  if (!body.follower || !body.following) {
    const status = 500;
    res.status(status).send({message: 'follower or followed are absent'});

    return undefined;
  }

  users.findOne({_id: body.follower})
    .lean(true)
    .exec()
    .then((user: User) => {
      const isFollowed = user.statistics.followings.includes(body.following);
      res.json({isFollowed});
    })
    .catch(err => {
      const status = 500;
      res.status(status).send({message: err});
    });
}
