/* tslint:disable:no-any */

import { Request, Response, Express } from 'express';
import * as mongoose from 'mongoose';
import { ObjectID } from 'bson';

import { updateUser } from '../servises/users.service';
import { getEvent, transformEventToResponceObj, updateEvent } from '../servises/events.service';
import { UpdateModel } from '../servises/update.interface';
import { HttpStatus } from '../enums/http-status';

const events = mongoose.model('Events');

interface CommonQuery {
  showName?: { $ne: string };
  creator?: { $ne: ObjectID };
  _id?: ObjectID | { $ne: ObjectID };
  buyers?: string;
  genre?: { $in: string[] };
  genres?: { $in: string[] };
  hashtags?: { $in: string[] };
  datePerformance?: { $gt: Date, $lt?: Date };
  showLocation?: string;
  completed?: boolean;
}

module.exports = (app: Express): void => {
  app.get('/get-non-live-events-amount', getNonLiveEventsAmountData);
  app.get('/get-events-list-by-query', getEventsDataByQuery);
  app.get('/get-my-events', getEventsDataByQuery);
  app.get('/get-free-ticket', getFreeTicket);
  app.post('/save-event', saveNewEvent);
};

function getNonLiveEventsAmountData(req: Request, res: Response): void {
  events
    .find({live: false}, {buyers: false})
    .count()
    .lean(true)
    .exec()
    .then(data => res.json(data))
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
    });
}

async function getEventsDataByQuery(req: Request, res: Response): Promise<void> {
  const query = req.query;
  const limit: number | null = query.limit ? +query.limit : null;
  const commonQuery: CommonQuery = {};

  if (query.genres) {
    commonQuery.genres = {$in: query.genres.split(',')};
  }

  if (query.hashtags) {
    query.hashtags = decodeURIComponent(query.hashtags);
    commonQuery.hashtags = {$in: query.hashtags.split(',')};
  }

  if (query.exceptById) {
    commonQuery._id = {$ne: new ObjectID(query.exceptById)};
  }

  if (query.minDate) {
    commonQuery.datePerformance = {$gt: new Date(query.minDate)};
  }

  if (query.exceptByName) {
    commonQuery.showName = {$ne: query.exceptByName};
  }

  if (query.exceptByCreator) {
    commonQuery.creator = {$ne: new ObjectID(query.exceptByCreator)};
  }

  if (query.findById) {
    commonQuery._id = query.findById;
  }

  if (query.findByBuyers) {
    commonQuery['buyers.userId'] = query.findByBuyers;
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

  if (query.findByCompleted) {
    commonQuery.completed = query.findByCompleted === `${true}`;
  }

  try {
    const list = await getEvent({query: commonQuery, limit});
    res.json(transformEventToResponceObj(list, query.userId));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
  }
}

async function saveNewEvent(req: Request, res: Response): Promise<void | undefined> {
  if (!req.body) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Failed, eventId or userId is empty'});

    return undefined;
  }

  try {
    const body = {
      ...req.body,
      buyers: []
    };

    const newEvent = await new events(body)
      .save();

    const params = {
      conditions: {
        _id: body.creator
      },
      doc: {
        $push: {
          'shows.owned': newEvent._id
        }
      }
    };
    await updateUser(params);
    res.json({message: 'user saved', newId: newEvent._id});

  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
  }
}

async function getFreeTicket(req: Request, res: Response): Promise<void | undefined> {
  const query = req.query;

  if (!query.eventId && !query.userId) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Failed, eventId or userId is empty'});

    return undefined;
  }

  try {
    const getEvtParams = {
      query: {
        _id: query.eventId,
        'buyers.userId': query.userId
      }
    };

    const isBuyed = await getEvent(getEvtParams);

    if (isBuyed.length) {
      res.json({message: 'You have already bought the ticket', isAlreadyExist: true});

      return undefined;
    }

    const eventParams: UpdateModel = {
      conditions: {_id: query.eventId},
      doc: {$push: {buyers: {userId: query.userId, isFree: true}}}
    };

    await updateEvent(eventParams);

    const userParams: UpdateModel = {
      conditions: {_id: query.userId},
      doc: {$push: {'shows.purchased': query.eventId}}
    };

    await updateUser(userParams);

    res.json({message: 'You have succsefully purchased the ticket', isAlreadyExist: false});
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
  }
}
