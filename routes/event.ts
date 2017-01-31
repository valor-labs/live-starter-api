import { Request, Express }  from 'express';
import { IEvent } from '../models/events';
import * as mongoose from 'mongoose';
const Events: any = mongoose.model('Events');

module.exports = (app: Express): void => {
  app.get('/getNonLiveEventsAmount', getNonLiveEventsAmountData);
  app.get('/getEventsListByQuery', getEventsDatabyQuery);
  app.post('/saveEvent', saveNewEvent);
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

function getEventsDatabyQuery(req: Request, res: any): Promise<any> {
  const query = req.query;
  const commonQuery: any = {datePerformance: query.findByDate};

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
