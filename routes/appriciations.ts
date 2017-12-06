/* tslint:disable:no-any */
/* tslint:disable:import-blacklist */

import { Request, Express } from 'express';
import * as mongoose from 'mongoose';
import { find, head, findIndex } from 'lodash';

const users = mongoose.model('Users');
const events = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.post('/appreciate-artist', appreciateArtist);
  app.post('/appreciate-event', appreciateEvent);
  app.post('/appreciate-song', appreciateSong);
  app.post('/appreciate-video', appreciateVideo);
};

function appreciateArtist(req: Request, res: any): Promise<any> | Function {
  const body = req.body;

  if (!body.email) {
    return res.json({
      success: false, data: 'user update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });
  }

  return users
    .find({email: body.artistAppreciate})
    .limit(1)
    .lean(true)
    .exec((err: Error, data: any): Promise<any> => {
      if (err) {

        return res.json({success: !err, data: 'DB error occured', error: err});
      }

      const found = head(data);
      const apprs = found.appreciations || [];
      const query: string = body.email;
      const founded = find(apprs, item => {
        return item === query;
      });

      if (apprs.length === 0 || !founded) {
        return users
          .update({email: body.artistAppreciate}, {
            $push: {
              appreciations: body.email
            }
          })
          .exec((error: Error): Function => {
            return res.json({success: !error, data: 'user updated', error});
          });
      }

      return users
        .update({email: body.artistAppreciate}, {
          $pull: {
            appreciations: body.email
          }
        })
        .exec((error: Error): Function => {
          return res.json({success: !error, data: 'user updated', error});
        });
    });
}

function appreciateEvent(req: Request, res: any): Promise<any> | Function {
  const body = req.body;

  if (!body.email) {
    return res.json({
      success: false, data: 'event update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });
  }

  return events
    .find({creator: body.artistAppreciate, datePerformance: body.datePerformance})
    .limit(1)
    .lean(true)
    .exec((err: Error, data: any): Promise<any> => {
      if (err) {

        return res.json({success: !err, data: 'DB error occured', error: err});
      }

      const found = head(data);
      const apprs = found.appreciations || [];
      const query: string = body.email;
      const founded = find(apprs, item => {
        return item === query;
      });

      if (apprs.length === 0 || !founded) {
        return events
          .update({creator: body.artistAppreciate, datePerformance: body.datePerformance}, {
            $push: {
              appreciations: body.email
            }
          })
          .exec((error: Error): Function => {
            return res.json({success: !error, data: 'event updated', error});
          });
      }

      return events
        .update({creator: body.artistAppreciate, datePerformance: body.datePerformance}, {
          $pull: {
            appreciations: body.email
          }
        })
        .exec((error: Error): Function => {
          return res.json({success: !error, data: 'event updated', error});
        });
    });
}

function appreciateSong(req: Request, res: any): Promise<any> | Function {
  const body = req.body;

  if (!body.email) {
    return res.json({
      success: false, data: 'song update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });
  }

  return events
    .find({
      creator: body.artistAppreciate,
      datePerformance: body.datePerformance
    })
    .limit(1)
    .lean(true)
    .exec((err: Error, data: any[]): Promise<any> => {
      if (err) {

        return res.json({success: !err, data: 'DB error occured', error: err});
      }

      const getEvent = head(data);
      const songs: any[] = getEvent.audio || [];
      const getSong = find(songs, (song: any) => song.name === body.name);
      const getSongIndex = findIndex(songs, (song: any) => song.name === body.name);
      const apprs: any[] = getSong ? getSong.appreciations || [] : [];
      const query: string = body.email;
      const founded = find(apprs, (item: any) => item === query);
      const field = `audio.${getSongIndex}.appreciations`;

      if (apprs.length === 0 || !founded) {
        return events
          .update({
            creator: body.artistAppreciate, datePerformance: body.datePerformance
          }, {
            $push: {
              [field]: body.email
            }
          })
          .exec((error: Error): Function => {
            return res.json({success: !error, data: 'song updated', error});
          });
      }

      return events
        .update({creator: body.artistAppreciate, datePerformance: body.datePerformance}, {
          $pull: {
            [field]: body.email
          }
        })
        .exec((error: Error): Function => {
          return res.json({success: !error, data: 'song updated', error});
        });
    });
}

function appreciateVideo(req: Request, res: any): Promise<any> | Function {
  const body = req.body;

  if (!body.email) {
    return res.json({
      success: false, data: 'video update failed', error: 'User has no email. ' +
      'Update without email prohibited.'
    });
  }

  return events
    .find({
      creator: body.artistAppreciate,
      datePerformance: body.datePerformance
    })
    .limit(1)
    .lean(true)
    .exec((err: Error, data: any[]): Promise<any> => {
      if (err) {

        return res.json({success: !err, data: 'DB error occured', error: err});
      }

      const getEvent = head(data);
      const videos: any[] = getEvent.video || [];
      const getVideo = find(videos, (video: any) => video.name === body.name);
      const getVideoIndex = findIndex(videos, (video: any) => video.name === body.name);
      const apprs: any[] = getVideo ? getVideo.appreciations || [] : [];
      const query: string = body.email;
      const founded = find(apprs, (item: any) => item === query);
      const field = `video.${getVideoIndex}.appreciations`;

      if (apprs.length === 0 || !founded) {
        return events
          .update({
            creator: body.artistAppreciate, datePerformance: body.datePerformance
          }, {
            $push: {
              [field]: body.email
            }
          })
          .exec((error: Error): Function => {
            return res.json({success: !error, data: 'video updated', error});
          });
      }

      return events
        .update({creator: body.artistAppreciate, datePerformance: body.datePerformance}, {
          $pull: {
            [field]: body.email
          }
        })
        .exec((error: Error): Function => {
          return res.json({success: !error, data: 'video updated', error});
        });
    });
}
