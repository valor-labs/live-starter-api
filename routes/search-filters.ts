/* tslint:disable:no-any */
/* tslint:disable:import-blacklist */

import { Request, Express } from 'express';
import * as mongoose from 'mongoose';

import { getUser, transformUsersToResponceObj } from '../servises/users.service';
import { HttpStatus } from '../enums/http-status';
import { getEvent, transformEventToResponceObj } from '../servises/events.service';

const users = mongoose.model('Users');

module.exports = (app: Express): void => {
  app.get('/get-artists-list', getArtistsList);
  app.get('/get-featured-artists-list', getFeaturedArtistsList);
  app.get('/search-by-query', searchByQuery);
};

function getArtistsList(req: Request, res: any): Promise<any> {
  const query: any = req.query;
  const findArtstsBy: any = {active: true};

  if (query.findByName) {
    findArtstsBy.username = query.findByName;
  }

  if (query.findByLocation) {
    findArtstsBy.country = query.findByLocation;
  }

  if (query.findByGenre) {
    findArtstsBy.genres = query.findByGenre;
  }

  return users
    .find(findArtstsBy)
    .lean(true)
    .exec((err: Error, data: any): Function => {
        return res.json({success: !err, data: {artists: data, amount: data.length}, error: err});
      }
    );
}

function getFeaturedArtistsList(req: Request, res: any): Promise<any> {
  const findArtstsBy: any = {active: true};
  const limitOfFoundUsers = 3;

  return users
    .find(findArtstsBy)
    .limit(limitOfFoundUsers)
    .lean(true)
    .exec((err: Error, data: any): Function => {
        return res.json({success: !err, data: {artists: data}, error: err});
      }
    );
}

async function searchByQuery(req: Request, res: any): Promise<void> {
  const queryRegex = new RegExp(`.*${req.query.query}.*`, `i`);

  const arrayOfQueryForUsers = [
    {
      username: {
        $regex: queryRegex
      }
    },
    {
      firstName: {
        $regex: queryRegex
      }
    },
    {
      lastName: {
        $regex: queryRegex
      }
    }
  ];

  const arrayOfQueryForEvents = [
    {
      name: {
        $regex: queryRegex
      }
    },
    {
      hashtags: {
        $in: [`#${req.query.query}`]
      }
    }
  ];

  try {
    const usersList = await getUser({query: {$or: arrayOfQueryForUsers}});
    const tranformedUser = transformUsersToResponceObj(usersList);
    const events = await getEvent({query: {$or: arrayOfQueryForEvents}});

    const respObj = {
      users: [],
      events: transformEventToResponceObj(events)
    };

    const eventParams = {
      query: {
        datePerformance: {$gt: new Date()}
      },
      sort: { datePerformance: 1, creator: -1}
    };

    const eventsForUser = await getEvent(eventParams);

    respObj.users = tranformedUser.map(user => {
      const userShows = eventsForUser.filter(event => {
        return event.creator === user._id.toString();
      });

      const tranformedShow = userShows.length ? transformEventToResponceObj([userShows[0]])[0] : null;

      return {
        user,
        show: tranformedShow
      };
    });

    res.json(respObj);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  }

}
