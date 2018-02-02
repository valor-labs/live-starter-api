import { Request, Response, Express } from 'express';

import { getUser, transformUsersToResponceObj } from '../servises/users.service';
import { UserResponse } from '../models/users';
import { getEvent, transformEventToResponceObj } from '../servises/events.service';

module.exports = (app: Express): void => {
  app.get('/get-artists-by-query', getArtistWithNextShow);
  app.get('/get-artists-amount', getArtistsAmount);
};

interface UsersQueryObj {
  active: boolean;
  username?: RegExp;
  country?: string;
  type?: string;
  genres?: {$in: string[]};
}

interface UsersRequestQueryObj {
  findByName?: string;
  findByLocation?: string;
  type?: string;
  findByGenre?: string;
}

function getArtistsAmount(req: Request, res: Response): void {
  getUser({})
    .then(users => {
      res.json(users.length);
    })
    .catch(err => {
      const status = 500;
      res.status(status).send(err);
    });
}

function parseQuery(query: UsersRequestQueryObj): UsersQueryObj {
  const usersQueryObj: UsersQueryObj = {
    active: true
  };

  if (query.findByName) {
    usersQueryObj.username = new RegExp(query.findByName);
  }

  if (query.findByLocation) {
    usersQueryObj.country = query.findByLocation;
  }

  if (query.findByGenre) {
    usersQueryObj.genres = {$in: query.findByGenre.split(',')};
  }

  return usersQueryObj;
}

async function getArtistWithNextShow(req: Request, res: Response): Promise<void | undefined> {
  const query = req.query;
  const usersQueryObj: UsersQueryObj = parseQuery(query);

  try {
    const users = await getUser({query: usersQueryObj});
    const tranformedUser: UserResponse[] = transformUsersToResponceObj(users);
    const eventParams = {
      query: {
        datePerformance: {$gt: new Date()}
      },
      sort: { datePerformance: 1, creator: -1}
    };

    const events = await getEvent(eventParams);

    const respObj = tranformedUser.map(user => {
      const userShows = events.filter(event => {
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
    const status = 500;
    res.status(status).send(err);
  }
}
