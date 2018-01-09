/* tslint:disable:no-any */

import { Request, Response, Express } from 'express';
import { Event } from '../models/events';
import * as mongoose from 'mongoose';
import { UpdatedDb } from '../models/updatedDB.interface';

const events = mongoose.model('Events');
const users = mongoose.model('Users');

interface CommonQuery {
  showName?: {$ne: string};
  creator?: {$ne: string};
  _id?: string;
  buyers?: string;
  genre?: {$in: string[]};
  datePerformance?: string;
  showLocation?: string;
}

module.exports = (app: Express): void => {
  app.get('/get-non-live-events-amount', getNonLiveEventsAmountData);
  app.get('/get-events-list-by-query', getEventsDataByQuery);
  app.get('/get-my-events', getEventsDataByQuery);
  app.post('/save-event', saveNewEvent);
};

function getNonLiveEventsAmountData(req: Request, res: Response): void {
  events
    .find({live: false}, {buyers: false})
    .count()
    .lean(true)
    .exec((err: Error, data: Event): void => {
        res.json({success: !err, data, error: err});
      }
    );
}

function getEventsDataByQuery(req: Request, res: Response): void {
  const query = req.query;
  const commonQuery: CommonQuery = {};

  if (query.exceptByName && query.exceptByCreator) {
    commonQuery.showName = {$ne: query.exceptByName};
    commonQuery.creator = {$ne: query.exceptByName};
  }

  if (query.findById) {
    commonQuery._id = query.findById;
  }

  if (query.findByBuyers) {
    commonQuery.buyers = query.findByBuyers;
  }

  if (query.findByCreator && query.findByName && !query.findById) {
    commonQuery.showName = query.findByName;
    commonQuery.creator = query.findByCreator;
  }

  if (query.findByDate) {
    commonQuery.datePerformance = query.findByDate;
  }

  if (query.findByGenre) {
    commonQuery.genre = {$in: [query.findByGenre]};
  }

  if (query.findByLocation) {
    commonQuery.showLocation = query.findByLocation;
  }

  events
    .find(commonQuery, {buyers: false})
    .lean(true)
    .exec((err: Error, data: Event[]): void => {
      const newData = data.map(show => {
        return {
          ...show,
          ...{
            statistics: {
              followers: show.statistics.followers.length,
              viewers: show.statistics.viewers.length,
              likes: show.statistics.likes.length
            }
          }
        };
      });

      res.json({success: !err, data: newData, error: err});
    });
}

function saveNewEvent(req: Request, res: Response): void {
  const body = {
    ...req.body,
    ...{buyers: []}
  };

  const newEvent = new events(body);

  newEvent.save((err: Error, event: Event): void | undefined => {
    if (err) {
      res.json({success: !err, data: null, err});

      return undefined;
    }

    users.update(
      {_id: body.creator},
      {
        $push: {
          'shows.owned': event._id
        }
      })
      .exec((error: Error, data: UpdatedDb): void => {
        res.json({success: !err, data: {message: 'user saved', newId: event._id}, error: err});
      });
  });
}
