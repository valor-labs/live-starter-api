/* tslint:disable:no-any */

import { Request, Express } from 'express';
import { Event } from '../models/events';
import * as mongoose from 'mongoose';
const events = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.get('/get-non-live-events-amount', getNonLiveEventsAmountData);
  app.get('/get-events-list-by-query', getEventsDataByQuery);
  app.post('/save-event', saveNewEvent);
};

function getNonLiveEventsAmountData(req: Request, res: any): Promise<any> {
  return events
    .find({live: false})
    .count()
    .lean(true)
    .exec((err: Error, data: Event): Function => {
        return res.json({success: !err, data, error: err});
      }
    );
}

function getEventsDataByQuery(req: Request, res: any): Promise<any> {
  const query = req.query;
  const commonQuery: any = {};

  if (query.exceptByName && query.exceptByCreator) {
    commonQuery.showName = {$ne: query.exceptByName};
    commonQuery.creator = {$ne: query.exceptByName};
  }

  if (query.findByCreator && query.findByName) {
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

  if (query.findByType) {
    // console.log('no logic yet!');
  }

  return events
    .find(commonQuery)
    .lean(true)
    .exec((err: Error, data: Event): Function => {
        return res.json({success: !err, data, error: err});
      }
    );
}

function saveNewEvent(req: Request, res: any): Promise<any> {
  const body: any = req.body;

  const newEvent = new events(body);

  return newEvent.save((err: Error): Function => {
    return res.json({success: !err, data: 'user saved', error: err});
  });
}
