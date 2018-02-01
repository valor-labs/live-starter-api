/* tslint:disable:no-any */
/* tslint:disable:import-blacklist */

import { Request, Express } from 'express';
import * as mongoose from 'mongoose';

const users = mongoose.model('Users');

module.exports = (app: Express): void => {
  app.get('/get-artists-list', getArtistsList);
  app.get('/get-featured-artists-list', getFeaturedArtistsList);
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
