/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Request, Express, Response } from 'express';

import { User } from '../models/users';

const users = mongoose.model('Users');

module.exports = (app: Express): void => {
  app.post('/follow-user', followUser);
};

async function followUser(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (!body.follower || !body.following) {
    const status = 500;
    res.status(status).send({message: 'follower or followed are absent. Update without thats prohibited.'});
  }

  try {
    await follow(body);
    await follow(body, false).then(result => {
      res.json(result);
    });
  } catch (error) {
    const status = 500;
    res.status(status).send(error);
  }
}

function follow(query: { follower: string; following: string; }, isFollower = true): Promise<string>  {
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
          .then(() => `You have started following ${user.username}`);
      }

      return users
        .update(
          {_id: updatingUserId},
          {$push: updatingField})
        .then(() => `You have stopped following ${user.username}`);
    });
}
