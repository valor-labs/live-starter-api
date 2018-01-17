/* tslint:disable:no-any */

import { Request, Response, Express } from 'express';
import { Event } from '../models/events';
import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';

const events = mongoose.model('Events');
const users = mongoose.model('Users');

interface CommonQuery {
  showName?: {$ne: string};
  creator?: {$ne: string};
  _id?: ObjectID | {$ne: ObjectID};
  buyers?: string;
  genre?: {$in: string[]};
  genres?: {$in: string[]};
  datePerformance?: {$gt: Date, $lt?: Date};
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
    .exec()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
      const status = 500;
      res.status(status).send({message: err});
    });
}

function getEventsDataByQuery(req: Request, res: Response): void {
  const query = req.query;
  const limit: number | null = query.limit ? +query.limit : null;
  const commonQuery: CommonQuery = {};

  if (query.genres) {
    commonQuery.genres = {$in: query.genres.split(',')};
  }

  if (query.exceptById) {
    commonQuery._id = {$ne: new ObjectID(query.exceptById)};
  }

  if (query.minDate) {
    commonQuery.datePerformance = {$gt: new Date(query.minDate)};
  }

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

  if (query.startDate && query.endDate) {
    commonQuery.datePerformance = {$gt: new Date(+query.startDate), $lt: new Date(+query.endDate)};
  }

  if (query.findByGenre) {
    commonQuery.genres = {$in: [query.findByGenre]};
  }

  if (query.findByLocation) {
    commonQuery.showLocation = query.findByLocation;
  }

  events
    .find(commonQuery, {buyers: false})
    .limit(limit)
    .lean(true)
    .exec()
    .then((data: Event[]) => {
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

      res.json(newData);
    })
    .catch(err => {
      const status = 500;
      res.status(status).send({message: err});
    });
}

function saveNewEvent(req: Request, res: Response): void {
  const body = {
    ...req.body,
    ...{buyers: []}
  };

  const newEvent = new events(body);

  newEvent.save()
    .then(event => {
      users.update(
        {_id: body.creator},
        {
          $push: {
            'shows.owned': event._id
          }
        })
        .exec()
        .then(() => {
          res.json({message: 'user saved', newId: event._id});
        })
        .catch(err => {
          const status = 500;
          res.status(status).send({message: err});
        });
    })
    .catch(err => {
      const status = 500;
      res.status(status).send({message: err});
    });
}
