/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Request, Express, Response } from 'express';

import { User } from '../models/users';
import { Event } from '../models/events';
import { LikingResponse } from '../models/likingResponse.interface';
import { HttpStatus } from '../enums/http-status';

const users = mongoose.model('Users');
const events = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.post('/show-like', likeShow);
  app.post('/artist-like', likeUser);
};

function updateLiker(query, isShowLike: boolean, isUpdateLikee = false): Promise<LikingResponse> {
  const userQueryId = isUpdateLikee ? query.likee : query.liker;

  return users
    .findOne({_id: userQueryId})
    .lean(true)
    .exec()
    .then((user: User) => {
      let statistics;
      let updatingObj;
      let isUnlike = false;

      if (isUpdateLikee) {
        statistics = user.statistics.likes.liked;
        isUnlike = statistics.includes(query.liker);
        updatingObj = {
          'statistics.likes.liked': query.liker
        };
      }

      if (!isUpdateLikee) {
        if (isShowLike) {
          statistics = user.statistics.likes.likeShow;
          updatingObj = {
            'statistics.likes.likeShow': query.likee
          };
        }

        if (!isShowLike) {
          statistics = user.statistics.likes.likeUser;

          updatingObj = {
            'statistics.likes.likeUser': query.likee
          };
        }

        isUnlike = statistics.includes(query.likee);
      }

      if (isUnlike) {
        return users
          .update(
            {_id: userQueryId},
            {
              $pull: updatingObj
            })
          .exec()
          .then(() => {
            if (isUpdateLikee) {
              return {
                message: 'show model unliked',
                likesCount: statistics.length ? statistics.length - 1 : 0
              };
            }
          });
      }

      return users
        .update(
          {_id: userQueryId},
          {
            $push: updatingObj
          }
        )
        .exec()
        .then(() => {
          if (isUpdateLikee) {
            return {
              message: 'show model liked',
              likesCount: statistics.length + 1
            };
          }
        });
    });
}

function updateShow(query): Promise<LikingResponse> {
  return events
    .findOne({_id: query.likee})
    .lean(true)
    .exec()
    .then((event: Event) => {
      const isUnlike = event.statistics.likes.includes(query.liker);

      if (isUnlike) {
        return events
          .update(
            {_id: query.likee},
            {
              $pull: {
                'statistics.likes': query.liker
              }
            })
          .then(() => {
            return {
              message: 'show model unliked',
              likesCount: event.statistics.likes.length ? event.statistics.likes.length - 1 : 0
            };
          });
      }

      return events
        .update(
          {_id: query.likee},
          {
            $push: {
              'statistics.likes': query.liker
            }
          })
        .then(() => {
          return {
            message: 'show model liked',
            likesCount: event.statistics.likes.length + 1
          };
        });

    });
}

async function likeShow(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (!body.liker || !body.likee) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({message: 'liker or likee are empty. Update without thats prohibited.'});
  }

  try {
    await updateLiker(body, true);

    await updateShow(body)
      .then(respObj => {
        res.json(respObj);
      });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

async function likeUser(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (!body.liker || !body.likee) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({message: 'liker or likee are empty. Update without thats prohibited.'});
  }

  try {
    await updateLiker(body, false);

    await updateLiker(body, false, true)
      .then((respObj: LikingResponse) => {
        res.json(respObj);
      });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
