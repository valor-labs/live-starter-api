/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Request, Express } from 'express';

const users = mongoose.model('Users');
const events = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.post('/show-like', likeShow);
};

function likeShow(req: Request, res: any): Promise<any> | Function {
  const body = req.body;

  if (!body.liker || !body.likee) {
    return res.json({
      success: true, data: 'like was failing', error: 'liker or likee are empty. ' +
      'Update without thats prohibited.'
    });
  }

  users
    .find({_id: body.liker})
    .lean(true)
    .exec((err: Error, data): void => {
      if (err) {
        return res.json({success: !err, data: null, error: err});
      }

      const statistics = data[0].statistics.likes.likeShow;
      const isUnlike = statistics.includes(body.likee);

      if (isUnlike) {
        users
          .update(
            {_id: body.liker},
            {
              $pull: {
                'statistics.likes.likeShow': body.likee
              }
            })
          .exec((error: Error, newData): void => {
            if (error) {
              return res.json({success: !error, data: null, error});
            }
          });

        return;
      }

      users
        .update(
          {_id: body.liker},
          {
            $push: {
              'statistics.likes.likeShow': body.likee
            }
          }
        )
        .exec((error: Error, newData): void => {
          if (error) {
            return res.json({success: !error, data: null, error});
          }
        });
    });

  return events
    .find({_id: body.likee})
    .limit(1)
    .lean(true)
    .exec((err: Error, show): Promise<any> => {
      if (err) {
        return res.json({success: !err, data: null, error: err});
      }

      const statistics = show[0].statistics.likes;
      const isUnlike = statistics.includes(body.liker);

      if (isUnlike) {
        return events
          .update(
            {_id: body.likee},
            {
              $pull: {
                'statistics.likes': body.liker
              }
            })
          .exec((error: Error, newData): Function => {
            if (error) {
              return res.json({success: !error, data: null, error});
            }

            const responseObj = {
              message: 'show model unliked',
              likesCount: show[0].statistics.likes.length ? show[0].statistics.likes.length - 1 : 0
            };

            return res.json({success: !error, data: responseObj, error});
          });
      }

      return events
        .update(
          {_id: body.likee},
          {
            $push: {
              'statistics.likes': body.liker
            }
          }
        )
        .exec((error: Error, newData): Function => {
          if (error) {
            return res.json({success: !error, data: null, error});
          }

          const responseObj = {
            message: 'show model liked',
            likesCount: show[0].statistics.likes.length + 1
          };

          return res.json({success: !error, data: responseObj, error});
        });
    });
}
