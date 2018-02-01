/* tslint:disable:no-any */

import * as mongoose from 'mongoose';

import { UpdateModel } from './update.interface';
import { User, UserResponse } from '../models/users';

const usersModel = mongoose.model('Users');

export function updateUser(params: UpdateModel): Promise<any> {
  return usersModel
    .update(params.conditions, params.doc)
    .exec();
}

export function getUser(params: {[key: string]: any}): Promise<User[]> {
  const projection = params.projection ? params.projection : {};

  return usersModel
    .find(params.query, projection)
    .lean(true)
    .limit(params.limit)
    .exec();
}

export function transformUsersToResponceObj(users: User[]): UserResponse[] {
  return users.map(user => {
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
}

export function createUser(user): Promise<User> {
  const newUser = new usersModel(user);

  return newUser.save();
}
