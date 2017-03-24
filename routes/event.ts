import { Request, Express }  from 'express';
import { IEvent } from '../models/events';
import * as mongoose from 'mongoose';
const Events: any = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.get('/get-non-live-events-amount', getNonLiveEventsAmountData);
  app.get('/get-events-list-by-query', getEventsDataByQuery);
  app.post('/save-event', saveNewEvent);
};

function getNonLiveEventsAmountData(req: Request, res: any): Promise<any> {
  return Events
    .find({live: false})
    .count()
    .lean(true)
    .exec((err: Error, data: IEvent): Function => {
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
    console.log('no logic yet!');
  }

  return Events
    .find(commonQuery)
    .lean(true)
    .exec((err: Error, data: IEvent): Function => {
        return res.json({success: !err, data, error: err});
      }
    );
}

function saveNewEvent(req: Request, res: any): Promise<any> {
  const body: any = req.body;

  let newEvent = new Events(body);

  return newEvent.save((err: Error): Function => {
    return res.json({success: !err, data: 'user saved', error: err});
  });
}
